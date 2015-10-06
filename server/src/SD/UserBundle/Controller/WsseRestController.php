<?php

namespace SD\UserBundle\Controller;

use SD\UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations\Get;

class WsseRestController extends Controller {

    /**
     * Returns the salt of the specified user.
     *
     * @param string $username
     * @return string
     *
     * @Get("{username}/salt")
     */
    public function saltAction($username) {
        /** @var $user User */
        $user = $this->getDoctrine()->getRepository("SDUserBundle:User")->findOneByUsername($username);
        if (!is_object($user)) {
            throw $this->createNotFoundException();
        }
        return $user->getSalt();
    }
}