<?php

namespace SD\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use SD\AppBundle\Entity\Account;

/**
 * User
 *
 * @ORM\Table(name="user")
 * @ORM\Entity
 */
class User extends BaseUser
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var Account
     *
     * @ORM\OneToMany(targetEntity="SD\AppBundle\Entity\Account", mappedBy="creator")
     */
    private $accounts;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->accounts = new ArrayCollection();
    }
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Add accounts
     *
     * @param Account $accounts
     * @return User
     */
    public function addAccount(Account $accounts)
    {
        $this->accounts[] = $accounts;
    
        return $this;
    }

    /**
     * Remove accounts
     *
     * @param Account $accounts
     */
    public function removeAccount(Account $accounts)
    {
        $this->accounts->removeElement($accounts);
    }

    /**
     * Get accounts
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getAccounts()
    {
        return $this->accounts;
    }
}