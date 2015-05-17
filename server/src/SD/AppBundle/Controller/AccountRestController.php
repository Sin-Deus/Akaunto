<?php

namespace SD\AppBundle\Controller;

use FOS\RestBundle\Util\Codes;
use SD\AppBundle\Entity\Account;
use SD\AppBundle\Form\AccountType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\BrowserKit\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AccountRestController extends Controller {

    /**
     * Returns the Account with the specified id.
     * @param number $id
     * @throw NotFoundException
     * @return Account
     */
    public function getAccountAction($id) {
        $account = $this->getDoctrine()->getRepository("SDAppBundle:Account")->findOneById($id);
        if (!is_object($account)) {
            throw $this->createNotFoundException();
        }
        return $account;
    }

    /**
     * Returns all the Accounts.
     * @return Account[]
     */
    public function getAccountsAction() {
        return $this->getDoctrine()->getRepository("SDAppBundle:Account")->findAll();
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
        $form->submit($request);

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
            throw new BadRequestHttpException();
        }
    }
}
