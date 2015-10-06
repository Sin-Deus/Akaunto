<?php

namespace SD\AppBundle\Controller;

use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\View\View;
use SD\AppBundle\Entity\Account;
use SD\AppBundle\Entity\AccountRepository;
use SD\AppBundle\Entity\UserAccountAssociation;
use SD\AppBundle\Form\AccountType;
use SD\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class AccountRestController extends Controller {

    /**
     * Returns the Account with the specified id.
     * @param number $id
     * @throw NotFoundException
     * @return Account
     */
    public function getAccountAction($id) {
        /** @var $user User */
        $user = $this->container->get('security.context')->getToken()->getUser();
        /** @var $account Account */
        $account = $this->getDoctrine()->getRepository('SDAppBundle:Account')->findOneById($id);
        if (!is_object($account)) {
            throw $this->createNotFoundException();
        }
        if (!$account->isUserAssociated($user)) {
            throw new AccessDeniedException();
        }
        return $account;
    }

    /**
     * Returns all the accounts associated to the current user.
     * @param ParamFetcher $paramFetcher
     * @return \SD\AppBundle\Entity\Account[]
     *
     * @QueryParam(name="creatorOnly", default=false, description="Whether or not returning only the accounts created by this user")
     */
    public function getAccountsAction(ParamFetcher $paramFetcher) {
        $creatorOnly = $paramFetcher->get("creatorOnly");
        /** @var $user User */
        $user = $this->container->get('security.context')->getToken()->getUser();
        /** @var $accountRepository AccountRepository */
        $accountRepository = $this->getDoctrine()->getRepository("SDAppBundle:Account");
        if ($creatorOnly) {
            return $accountRepository->findByCreator($user);
        } else {
            return $accountRepository->findAccountsForUser($user);
        }
    }

    /**
     * Creates a new Account.
     * @param Request $request
     * @throw BadRequestHttpException
     * @return Account
     */
    public function postAccountAction(Request $request) {
        $account = new Account();
        $form = $this->createForm(new AccountType(), $account);
        $form->handleRequest($request);

        if (!$form->isValid()) {
            throw new BadRequestHttpException();
        }

        /** @var $user User */
        $user = $this->container->get('security.context')->getToken()->getUser();

        $associatedUser = new UserAccountAssociation();
        $associatedUser
            ->setAccount($account)
            ->setUser($user)
            ->setPermission(UserAccountAssociation::PERMISSION_EDIT);
        $account->addAssociatedUser($associatedUser);
        $account->setCreator($user);

        $em = $this->getDoctrine()->getManager();
        $em->persist($account);
        $em->flush();

        return View::create($account, Codes::HTTP_CREATED);
    }

    /**
     * Deletes the specified account, only if the current user is this account creator.
     * @param number $id
     * @throw NotFoundException
     * @throw AccessDeniedException
     * @return View
     */
    public function deleteAccountAction($id) {
        /** @var $user User */
        $user = $this->container->get('security.context')->getToken()->getUser();
        /** @var $account Account */
        $account = $this->getDoctrine()->getRepository('SDAppBundle:Account')->findOneById($id);

        if (!is_object($account)) {
            throw $this->createNotFoundException();
        }

        if ($account->getCreator() !== $user) {
            throw new AccessDeniedException();
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($account);
        $em->flush();

        return View::create(null, Codes::HTTP_NO_CONTENT);
    }

    /**
     * Updates the specified account, only if the current user has at least the 'EDIT' permission on this account.
     * @param number $id
     * @throw NotFoundException
     * @throw AccessDeniedException
     * @throw BadRequestHttpException
     * @return Account
     */
    public function putAccountAction($id) {
        /** @var $user User */
        $user = $this->container->get('security.context')->getToken()->getUser();
        /** @var $account Account */
        $account = $this->getDoctrine()->getRepository('SDAppBundle:Account')->findOneById($id);

        if (!is_object($account)) {
            throw $this->createNotFoundException();
        }

        if (!$account->hasUserPermissionToEdit($user)) {
            throw new AccessDeniedException;
        }

        $request = $this->getRequest();
        $form = $this->createForm(new AccountType(), $account, array(
            'method' => 'PUT'
        ));
        $form->handleRequest($request);

        if (!$form->isValid()) {
            throw new BadRequestHttpException();
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($account);
        $em->flush();

        return View::create($account, Codes::HTTP_OK);
    }
}
