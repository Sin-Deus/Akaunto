<?php

namespace SD\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('SDAppBundle:Default:index.html.twig', array('name' => $name));
    }
}
