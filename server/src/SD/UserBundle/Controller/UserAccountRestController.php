<?php

namespace SD\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations as Rest;

class UserAccountRestController extends Controller {

    /**
     * Returns all the accounts associated to the specified user.
     *
     * @Rest\QueryParam(name="creatorOnly", default=false, description="Whether or not returning only the accounts created by this user")
     *
     * @param {ParamFetcher} $paramFetcher
     * @param {number} $id The user id.
     * @return \SD\AppBundle\Entity\Account[]
     */
    public function getAccountsAction(ParamFetcher $paramFetcher, $id) {
        $creatorOnly = $paramFetcher->get("creatorOnly");
        if ($creatorOnly) {
            return $this->getDoctrine()->getRepository("SDAppBundle:Account")->findByCreator($id);
        } else {
            // TODO
            return [];
        }
    }
}
