<?php

namespace SD\UserBundle\Controller;

use SD\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class UserRestController extends Controller {

    /**
     * Returns the current user.
     * @return User
     */
    public function meUserAction() {
        /** @var $user User */
        return $this->container->get('security.context')->getToken()->getUser();
    }

    /**
     * Returns the specified user.
     * @param number $id
     * @throw NotFoundException
     * @return User
     */
    public function getUserAction($id) {
        /** @var $user User */
        $user = $this->getDoctrine()->getRepository("SDUserBundle:User")->findOneById($id);
        if (!is_object($user)) {
            throw $this->createNotFoundException();
        }
        return $user;
    }

    /**
     * Returns all the users.
     * @return User[]
     */
    public function getUsersAction() {
        return $this->getDoctrine()->getRepository("SDUserBundle:User")->findAll();
    }
}
