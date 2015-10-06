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
 * @ORM\Entity(repositoryClass="UserRepository")
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
     * @ORM\OneToMany(targetEntity="SD\AppBundle\Entity\Account", mappedBy="creator", fetch="EXTRA_LAZY")
     */
    private $accounts;

    /**
     * @var \SD\AppBundle\Entity\UserAccountAssociation
     *
     * @ORM\OneToMany(targetEntity="SD\AppBundle\Entity\UserAccountAssociation", mappedBy="user", fetch="EXTRA_LAZY")
     */
    private $associatedAccounts;

    /**
     * Constructor
     */
    public function __construct()
    {
		parent::__construct();
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

    /**
     * Add associatedAccounts
     *
     * @param \SD\AppBundle\Entity\UserAccountAssociation $associatedAccounts
     * @return User
     */
    public function addAssociatedAccount(\SD\AppBundle\Entity\UserAccountAssociation $associatedAccounts)
    {
        $this->associatedAccounts[] = $associatedAccounts;
    
        return $this;
    }

    /**
     * Remove associatedAccounts
     *
     * @param \SD\AppBundle\Entity\UserAccountAssociation $associatedAccounts
     */
    public function removeAssociatedAccount(\SD\AppBundle\Entity\UserAccountAssociation $associatedAccounts)
    {
        $this->associatedAccounts->removeElement($associatedAccounts);
    }

    /**
     * Get associatedAccounts
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getAssociatedAccounts()
    {
        return $this->associatedAccounts;
    }
}