<?php

namespace SD\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class UserRestController extends Controller {

    public function getUsersMeAction() {
        $user = $this->container->get('security.context')->getToken()->getUser();
        return $user;
    }

    public function getUserAction($id) {
        $user = $this->getDoctrine()->getRepository("SDUserBundle:User")->findOneById($id);
        if (!is_object($user)) {
            throw $this->createNotFoundException();
        }
        return $user;
    }

    public function getUsersAction() {
        return $this->getDoctrine()->getRepository("SDUserBundle:User")->findAll();
    }
}
