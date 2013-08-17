import argparse
import json
import os
import time
import unittest

from selenium import webdriver

driver = None

def setUpModule():
    """Create the test browser only once to avoid overhead."""
    global driver

    parser = argparse.ArgumentParser()
    parser.add_argument('--chrome', action='store_true')
    parser.add_argument('--firefox', action='store_true')
    flags = parser.parse_args()
    if flags.firefox:
        driver = webdriver.Firefox()
    else:
        driver = webdriver.Chrome()


def tearDownModule():
    driver.close()


class Page(object):

    def __init__(self):
        driver.get('file://{}/index.html#testing'.format(os.getcwd()))
        self._main_page = driver.find_element_by_id('mainPage')
        self._account_password_page = driver.find_element_by_id('accountPasswordPage')
        self._nickname = driver.find_element_by_id('nickname')
        self._master_password = driver.find_element_by_id('masterPassword')
        self._new_nickname = driver.find_element_by_id('newNickname')
        self._master_password2 = driver.find_element_by_id(
                'validateMasterPassword')
        self._create_button = driver.find_element_by_id('createAccountPassword')
        self._account_password = driver.find_element_by_id('accountPassword')

    @property
    def nickname(self):
        return self._nickname.get_attribute('value')

    @nickname.setter
    def nickname(self, value):
        self._nickname.send_keys(value)

    @property
    def master_password(self):
        return self._master_password.get_attribute('value')

    @master_password.setter
    def master_password(self, value):
        self._master_password.send_keys(value)

    @property
    def new_nickname(self):
        return self._new_nickname.get_attribute('checked') == 'true'

    @new_nickname.setter
    def new_nickname(self, value):
        if value:
            self._new_nickname.send_keys(' ')
        else:
            raise ValueError('cannot turn off checkbox')

    @property
    def master_password2(self):
        return self._master_password2.get_attribute('value')

    @master_password2.setter
    def master_password2(self, value):
        self._master_password2.send_keys(value)

    @property
    def account_password(self):
        return self._account_password.get_attribute('value')

    def create_account_password(self):
        self._create_button.click()
        return self.account_password


class AlgorithmTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with open('selenium/testdata.json') as file:
            cls.test_data = json.load(file)

    def test_algorithm(self):
        for test in self.test_data:
            page = Page()
            page.nickname = test['label']
            page.master_password = test['master']
            account_password = page.create_account_password()
            self.assertEqual(test['password'], account_password, test['why'])


class UXTest(unittest.TestCase):

    nickname = 'nickname'
    master_password = 'master password'
    account_password = '7CsZ--jK'

    def setUp(self):
        self.page = Page()

    def _verify_no_master_passwords(self):
        """Check that no master password fields contain data."""
        self.assertFalse(self.page.master_password)
        self.assertFalse(self.page.master_password2)

    def verify_success(self):
        """Check that after a successful creation of an account password that
        sensitive data has been cleared."""
        self.assertFalse(self.page.nickname)
        self._verify_no_master_passwords()
        self.assertTrue(self.page.account_password)
        self.assertFalse(self.page._main_page.is_displayed())
        self.assertTrue(self.page._account_password_page.is_displayed())

    def verify_failure(self):
        """Check that after a failed attempt to create an account password there
        are no master password fields filled."""
        self.assertTrue(self.page.nickname)
        self._verify_no_master_passwords()
        self.assertFalse(self.page.account_password)
        self.assertTrue(self.page._main_page.is_displayed())
        self.assertFalse(self.page._account_password_page.is_displayed())

    def test_new_nickname_click(self):
        """Check that the UI is in the expected state when choosing to make a
        new nickname."""
        self.assertTrue(self.page._new_nickname.is_displayed())
        self.assertFalse(self.page._master_password2.is_displayed())
        self.page.new_nickname = True
        self.assertFalse(self.page._new_nickname.is_displayed())
        self.assertTrue(self.page._master_password2.is_displayed())


    def test_typical(self):
        """Nick + Master = Account"""
        self.page.nickname = self.nickname
        self.page.master_password = self.master_password
        found = self.page.create_account_password()
        self.assertEqual(self.account_password, found)
        self.verify_success()

    def test_new_nickname(self):
        """Nick + Master + New + Master2 = Account"""
        self.page.nickname = self.nickname
        self.page.master_password = self.master_password
        self.page.new_nickname = True
        self.page.master_password2 = self.master_password
        found = self.page.create_account_password()
        self.assertEqual(self.account_password, found)
        self.verify_success()

    def test_bad_master(self):
        """Nick +!Master + New + Master2 = ERROR"""
        self.page.nickname = self.nickname
        self.page.master_password = self.master_password
        self.page.new_nickname = True
        self.page.master_password2 = self.master_password + '!'
        found = self.page.create_account_password()
        self.assertEqual('', found)
        self.verify_failure()
        self.assertFalse(self.page._new_nickname.is_displayed())
        self.assertTrue(self.page._master_password2.is_displayed())

    def test_bad_master_then_good(self):
        """Nick + !Master + New + Master2 + Master = Account"""
        self.test_bad_master()
        self.page.master_password = self.master_password
        self.page.master_password2 = self.master_password
        found = self.page.create_account_password()
        self.assertEqual(self.account_password, found)
        self.verify_success()


if __name__ == '__main__':
    loader = unittest.defaultTestLoader
    suite = loader.loadTestsFromName('__main__')
    unittest.TextTestRunner().run(suite)
