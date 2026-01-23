module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Tính năng mới
        'fix', // Sửa lỗi
        'docs', // Thay đổi documentation
        'style', // Format code (không ảnh hưởng logic)
        'refactor', // Refactor code
        'perf', // Cải thiện performance
        'test', // Thêm hoặc sửa tests
        'build', // Thay đổi build system hoặc dependencies
        'ci', // Thay đổi CI configuration
        'chore', // Các thay đổi khác không ảnh hưởng src hoặc test
        'revert', // Revert commit trước đó
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
