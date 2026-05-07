export interface JobRunner {
  run<T>(name: string, run: () => Promise<T>): Promise<T>;
}

export class InlineJobRunner implements JobRunner {
  async run<T>(_name: string, run: () => Promise<T>): Promise<T> {
    return run();
  }
}
