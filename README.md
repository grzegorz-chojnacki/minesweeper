# Minesweeper

This is a minesweeper clone built with [Angular](https://angular.io/)
using [Material UI](https://material.angular.io/) components.

View deployed app [here](https://grzegorz-chojnacki.github.io/minesweeper/)!

![Preview](https://raw.github.com/grzegorz-chojnacki/minesweeper/master/images/minesweeper-preview.png)

## Technical features
- Fully playable minesweeper written in [TypeScript](https://www.typescriptlang.org/)
- Stylized with [Sass](https://sass-lang.com/) using mixins and theme palettes
- Optimized with `ChangeDetectionStrategy.onPush`
- Testing suite with high test coverage (above ~90%) using [Jasmine](https://jasmine.github.io/) and [Karma](https://karma-runner.github.io/latest/index.html)
- Integration with material components tested with [Component Harnesses](https://material.angular.io/cdk/test-harnesses/overview)
- [Reactive forms](https://angular.io/guide/reactive-forms) validation with synchronization between inputs
- Data synchronization between components with services and events
- Local data storage
- Pure pipes

### GitHub-Pages deployment

```shell
$ ng deploy --base-href=/minesweeper/
```