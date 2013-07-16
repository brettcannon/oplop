(require 'json)
(require 'oplop)


(defun test:read-file-contents (file)
  (with-temp-buffer
    (insert-file-contents file)
    (buffer-string)))


(defun test:read-test-data (file)
  (json-read-from-string (test:read-file-contents file)))


(defun test:test-value (key assoc-list)
  (cdr (assq key assoc-list)))


(defun test:ert-test (data)
  (let ((label (test:test-value 'label data))
        (master (test:test-value 'master data))
        (expected-password (test:test-value 'password data)))
    (should (string= (oplop:account-password label master) expected-password))))


(ert-deftest test:test-all()
  (let ((test-data (test:read-test-data "testdata.json")))
    (mapcar #'test:ert-test test-data)))
