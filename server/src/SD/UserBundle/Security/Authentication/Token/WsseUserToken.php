<?php

namespace SD\UserBundle\Security\Authentication\Token;

use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;

class WsseUserToken extends AbstractToken {

    public $created;
    public $digest;
    public $nonce;

    /**
     * Constructs a new WsseUserToken.
     *
     * @param array $roles
     */
    public function __construct(array $roles = array()) {
        parent::__construct($roles);

        // If the user has roles, consider them authenticated.
        $this->setAuthenticated(count($roles) > 0);
    }

    /**
     * Returns the user credentials.
     *
     * @return mixed The user credentials
     */
    public function getCredentials()
    {
        return '';
    }
}