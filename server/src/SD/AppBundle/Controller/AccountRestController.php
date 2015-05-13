<?php

namespace SD\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AccountRestController extends Controller {

    public function getAccountAction($id) {
        $account = $this->getDoctrine()->getRepository("SDAppBundle:Account")->findOneById($id);
        if (!is_object($account)) {
            throw $this->createNotFoundException();
        }
        return $account;
    }

    public function getAccountsAction() {
        return $this->getDoctrine()->getRepository("SDAppBundle:Account")->findAll();
    }
}
