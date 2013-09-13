from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import contextlib
import os
import unittest


@contextlib.contextmanager
def DriverManager(driver):
    try:
        # Load
        driver.get('file://{}/index.html'.format(os.getcwd()))
        # Wait until page is loaded
        wait = WebDriverWait(driver, 5)
        wait.until(EC.visibility_of((By.ID, 'nickname')))
        # Proceed
        yield driver
    finally:
        driver.close()


class EndToEndTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('file://{}/index.html'.format(os.getcwd()))
        wait = WebDriverWait(self.driver, 5)
        wait.until(EC.presence_of_element_located((By.ID, 'nickname')))

    def tearDown(self):
        self.driver.close()

    @property
    def nickname(self):
        return self.driver.find_element_by_id('nickname')

    @property
    def master_password(self):
        return self.driver.find_element_by_id('masterPassword')

    def verify_password(self):
        self.driver.find_element_by_id('newNickname').click()

    @property
    def master_password_again(self):
        return self.driver.find_element_by_id('validateMasterPassword')

    def submit(self):
        button = self.driver.find_element_by_id('createAccountPassword')
        button.click()

    @property
    def options_button(self):
        return self.driver.find_element_by_id('optionsButton')

    @property
    def nicknames_link(self):
        return self.driver.find_element_by_id('nicknamesLink')

    @property
    def options_close(self):
        return self.driver.find_element_by_id('optionsClose')

    @property
    def account_password(self):
        field = self.driver.find_element_by_id('accountPassword')
        return field.get_attribute('value')

    @property
    def start_over(self):
        return self.driver.find_element_by_id('startOver')

    def _wait_for_id(self, id_):
        wait = WebDriverWait(self.driver, 5)
        wait_for = EC.visibility_of_element_located((By.ID, id_))
        wait.until(wait_for)

    def wait_for_transition(self):
        self._wait_for_id('accountPassword')

    def wait_for_options(self):
        self._wait_for_id('nicknamesLink')

    def wait_for_main(self):
        self._wait_for_id('nickname')

    def test_typical(self):
        # Typical workflow.
        self.nickname.send_keys('a')
        self.master_password.send_keys('a')
        self.submit()
        self.wait_for_transition()
        self.assertEqual('QSS8CpM1', self.account_password)

    def test_verify_master_password(self):
        self.nickname.send_keys('a')
        self.master_password.send_keys('a')
        self.verify_password()
        self.master_password_again.send_keys('a')
        self.submit()
        self.wait_for_transition()
        self.assertEqual('QSS8CpM1', self.account_password)

    def test_master_password_failed_verification(self):
        self.nickname.send_keys('a')
        self.master_password.send_keys('a')
        self.verify_password()
        self.master_password_again.send_keys('b')
        self.submit()
        self.assertTrue(self.master_password.is_displayed())
        self.assertTrue(self.master_password_again.is_displayed())
        self.assertEqual('', self.master_password.get_attribute('value'))
        self.assertEqual('', self.master_password_again.get_attribute('value'))

        self.master_password.send_keys('a')
        self.master_password_again.send_keys('a')
        self.submit()
        self.wait_for_transition()
        self.assertEqual('QSS8CpM1', self.account_password)

    def test_start_over(self):
        # Verify, don't bother, verify.
        self.test_verify_master_password()
        self.start_over.click()
        self.assertTrue(self.nickname.is_displayed())

        self.wait_for_main()
        self.test_typical()
        self.start_over.click()
        self.assertTrue(self.nickname.is_displayed())

        self.wait_for_main
        self.test_verify_master_password()

    def test_options(self):
        # Test setting options, the resulting links, and changing the values.
        self.options_button.click()
        self.wait_for_options()

        self.nicknames_link.send_keys('abc')
        self.options_close.click()

        self.wait_for_main()
        links = self.driver.find_elements_by_class_name('linkToNicknames')
        self.assertEqual(2, len(links))
        for node in links:
            self.assertTrue(node.get_attribute('href').endswith('/abc'))

        self.options_button.click()
        self.wait_for_options()
        self.nicknames_link.clear()
        self.nicknames_link.send_keys('xyz')
        self.options_close.click()
        self.wait_for_main()
        links = self.driver.find_elements_by_class_name('linkToNicknames')
        self.assertEqual(2, len(links))
        for node in links:
            self.assertTrue(node.get_attribute('href').endswith('/xyz'))


if __name__ == '__main__':
    unittest.main()
