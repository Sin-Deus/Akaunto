<?php

namespace SD\AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Account
 *
 * @ORM\Table(name="account")
 * @ORM\Entity
 */
class Account
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var boolean
     *
     * @ORM\Column(name="isSavings", type="boolean", options={ "default"=false })
     */
    private $isSavings;

    /**
     * @var integer
     *
     * @ORM\Column(name="currentBalance", type="bigint")
     */
    private $currentBalance;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="lastReconciliation", type="date")
     */
    private $lastReconciliation;

    /**
     * @var \SD\UserBundle\Entity\User
     *
     * @ORM\ManyToOne(targetEntity="SD\UserBundle\Entity\User", inversedBy="accounts")
     * @ORM\JoinColumn(name="creator_id", referencedColumnName="id", nullable=false)
     */
    private $creator;

    /**
     * @var \SD\AppBundle\Entity\UserAccountAssociation
     *
     * @ORM\OneToMany(targetEntity="SD\AppBundle\Entity\UserAccountAssociation", mappedBy="account", fetch="EXTRA_LAZY")
     */
    private $associatedUsers;


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
     * Set name
     *
     * @param string $name
     * @return Account
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set isSavings
     *
     * @param boolean $isSavings
     * @return Account
     */
    public function setIsSavings($isSavings)
    {
        $this->isSavings = $isSavings;
    
        return $this;
    }

    /**
     * Get isSavings
     *
     * @return boolean 
     */
    public function getIsSavings()
    {
        return $this->isSavings;
    }

    /**
     * Set currentBalance
     *
     * @param integer $currentBalance
     * @return Account
     */
    public function setCurrentBalance($currentBalance)
    {
        $this->currentBalance = $currentBalance;
    
        return $this;
    }

    /**
     * Get currentBalance
     *
     * @return integer 
     */
    public function getCurrentBalance()
    {
        return $this->currentBalance;
    }

    /**
     * Set lastReconciliation
     *
     * @param \DateTime $lastReconciliation
     * @return Account
     */
    public function setLastReconciliation($lastReconciliation)
    {
        $this->lastReconciliation = $lastReconciliation;
    
        return $this;
    }

    /**
     * Get lastReconciliation
     *
     * @return \DateTime 
     */
    public function getLastReconciliation()
    {
        return $this->lastReconciliation;
    }

    /**
     * Set creator
     *
     * @param \SD\UserBundle\Entity\User $creator
     * @return Account
     */
    public function setCreator($creator)
    {
        $this->creator = $creator;
    
        return $this;
    }

    /**
     * Get creator
     *
     * @return \SD\UserBundle\Entity\User
     */
    public function getCreator()
    {
        return $this->creator;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->associatedUsers = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add associatedUsers
     *
     * @param \SD\AppBundle\Entity\UserAccountAssociation $associatedUsers
     * @return Account
     */
    public function addAssociatedUser(\SD\AppBundle\Entity\UserAccountAssociation $associatedUsers)
    {
        $this->associatedUsers[] = $associatedUsers;
    
        return $this;
    }

    /**
     * Remove associatedUsers
     *
     * @param \SD\AppBundle\Entity\UserAccountAssociation $associatedUsers
     */
    public function removeAssociatedUser(\SD\AppBundle\Entity\UserAccountAssociation $associatedUsers)
    {
        $this->associatedUsers->removeElement($associatedUsers);
    }

    /**
     * Get associatedUsers
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getAssociatedUsers()
    {
        return $this->associatedUsers;
    }

    /**
     * Checks whether or not the specified user is associated to this account.
     *
     * @param \SD\UserBundle\Entity\User $user
     * @return boolean
     */
    public function isUserAssociated($user) {
        $isUserAssociated = false;
        foreach ($this->associatedUsers as $associatedUser) {
            $isUserAssociated = $isUserAssociated || $associatedUser->getUser()->getId() === $user->getId();
        }
        return $isUserAssociated;
    }
}