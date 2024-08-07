// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter'),
      require('karma-sabarivka-reporter'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      include: 'src/**/!(*.spec|*.module|environment*|main).(ts|js)',
      dir: require('path').join(__dirname, './test-results/unit-tests/code-coverage'),
      reporters: [
        { type: 'html', includeAllSources: true, subdir: 'html'},
        { type: 'text-summary', includeAllSources: true },
        { type: 'cobertura', includeAllSources: true, subdir: 'cobertura' }
      ]
    },
    reporters: ['sabarivka', 'progress', 'kjhtml', 'junit'],
    junitReporter: {
      outputDir: 'test-results/unit-tests', // results will be saved as $outputDir/$browserName.xml
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--remote-debugging-port=9333"
        ]
      }
    },
    restartOnFileChange: true
  });
};
