<?php

namespace SD\UserBundle\Controller;

use Doctrine\ORM\NoResultException;
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
        try {
            return $this->getDoctrine()->getRepository("SDUserBundle:User")->getSaltByUsername($username);
        } catch (NoResultException $e) {
            throw $this->createNotFoundException();
        }
    }
}