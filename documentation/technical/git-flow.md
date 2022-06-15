# Git Flow

We will follow a classical git flow with these branches:

- **main/master**: always reflects a production-ready state.
- **develop**: a stable point where we stack the features
- **feature**: branches under feature are were you can develop your new functionnalities
- **release**: put code here when a release is created.
- **hotfix**: develop bugfixes before merging to develop.

![git flow](./images/git-flow.png)

> References: https://nvie.com/posts/a-successful-git-branching-model/

## Sementical Commit

It would be nice of you to use `sementical commit` convention for your commit messages.
Please find below how to write a sementical commit message.

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

> _References_: https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

## Git Charter

> Here are a few statements that we will ask you to respect in order to develop in the best environment.

1. I will always push in my **dedicated feature branch**
2. I will **never** push into **master/main**
3. **One ticket** means **one feature or hotfix** branch
4. I will ask a **code review** before merging into develop

## Code Review

A code review is allow a pair to read your code in order to check if your code `respects` the `good practices` of the project.

He will add some comments that you have to resolve before merging into `develop`.

A code review is **not** done to ensure your development is working as expected. This is the job of **Unit Tests** and **Integration Tests**.

You can ask a code review for a PR in the dedicated channel of the discord.
