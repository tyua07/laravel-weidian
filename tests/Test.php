<?php

class Test extends TestCase
{

	public function testTrue()
	{
		$this->assertTrue(false);
		return "true";
	}

	/**
	 * @depends testTrue
	 */
	public function testFalse()
	{
		$this->assertFalse(false);
		return false;
	}

}
