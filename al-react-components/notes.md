https://dev.to/siddharthvenkatesh/component-library-setup-with-react-typescript-and-rollup-onj
https://superface.ai/blog/npm-publish-gh-actions-changelog
https://blog.logrocket.com/build-component-library-react-typescript/
https://dev.to/riywo/using-github-release-for-patching-monorepo-npm-package-4k7a

Husk at sætte repository i package.json, så der publishes til rigtigt package repository (https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages#configuring-the-destination-repository)

- run: echo "${{ toJson(${{ github.event) }}"

release?
https://michaelzanggl.com/articles/github-actions-cd-setup/
https://www.atkinsondev.com/post/github-actions-releasing-different-tags/
