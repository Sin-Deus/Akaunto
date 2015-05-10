<?php

namespace SD\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class UserRestController extends Controller {

    public function getUserAction($username) {
        $user = $this->getDoctrine()->getRepository("SDUserBundle:User")->findOneByUsername($username);
        if (!is_object($user)) {
            throw $this->createNotFoundException();
        }
        return $user;
    }

    public function getUsersAction() {
        return $this->getDoctrine()->getRepository("SDUserBundle:User")->findAll();
    }
}
