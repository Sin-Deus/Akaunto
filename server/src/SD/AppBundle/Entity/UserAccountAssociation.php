<?php

namespace SD\AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use SD\AppBundle\Entity\Account;
use SD\UserBundle\Entity\User;
use JMS\Serializer\Annotation\Exclude;

/**
 * UserAccountAssociation
 *
 * @ORM\Table(name="user_account_association")
 * @ORM\Entity
 */
class UserAccountAssociation
{

    /**
     * Permission for a user to view an account.
     *
     * @var number
     *
     * @Exclude
     */
    const PERMISSION_VIEW = 0;

    /**
     * Permission for a user to edit an account.
     *
     * @var number
     *
     * @Exclude
     */
    const PERMISSION_EDIT = 1;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="permission", type="smallint")
     */
    private $permission;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="SD\UserBundle\Entity\User", inversedBy="associatedAccounts")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    private $user;

    /**
     * @var Account
     *
     * @ORM\ManyToOne(targetEntity="SD\AppBundle\Entity\Account", inversedBy="associatedUsers")
     * @ORM\JoinColumn(name="account_id", referencedColumnName="id", nullable=false)
     */
    private $account;

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
     * Set permission
     *
     * @param integer $permission
     * @return UserAccountAssociation
     */
    public function setPermission($permission)
    {
        $this->permission = $permission;
    
        return $this;
    }

    /**
     * Get permission
     *
     * @return integer 
     */
    public function getPermission()
    {
        return $this->permission;
    }

    /**
     * Set user
     *
     * @param User $user
     * @return UserAccountAssociation
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    
        return $this;
    }

    /**
     * Get user
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set account
     *
     * @param Account $account
     * @return UserAccountAssociation
     */
    public function setAccount(Account $account)
    {
        $this->account = $account;
    
        return $this;
    }

    /**
     * Get account
     *
     * @return Account
     */
    public function getAccount()
    {
        return $this->account;
    }
}