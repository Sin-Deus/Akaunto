<?php

namespace SD\AppBundle\Controller;

use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Util\Codes;
use SD\AppBundle\Entity\Account;
use SD\AppBundle\Form\AccountType;
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
        /** @var $user \SD\UserBundle\Entity\User */
        $user = $this->container->get('security.context')->getToken()->getUser();
        /** @var $account \SD\AppBundle\Entity\Account */
        $account = $this->getDoctrine()->getRepository("SDAppBundle:Account")->findOneById($id);
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
     *
     * @QueryParam(name="creatorOnly", default=false, description="Whether or not returning only the accounts created by this user")
     *
     * @param ParamFetcher $paramFetcher
     * @return \SD\AppBundle\Entity\Account[]
     */
    public function getAccountsAction(ParamFetcher $paramFetcher) {
        $creatorOnly = $paramFetcher->get("creatorOnly");
        /** @var $user \SD\UserBundle\Entity\User */
        $user = $this->container->get('security.context')->getToken()->getUser();
        if ($creatorOnly) {
            return $this->getDoctrine()->getRepository("SDAppBundle:Account")->findByCreator($user);
        } else {
            $em = $this->getDoctrine()->getManager();
            $query = $em->createQuery("SELECT a, au FROM SDAppBundle:Account a JOIN a.associatedUsers au WHERE au.user = :id");
            $query->setParameters(["id" => $user->getId()]);
            return $query->getResult();
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

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($account);
            $em->flush();

            return $this->redirect(
                $this->generateUrl(
                    'api_get_account',
                    array('id' => $account->getId())
                ),
                Codes::HTTP_CREATED
            );
        } else {
            return $form;
            throw new BadRequestHttpException();
        }
    }
}
