import { SlaStrategy } from "./SlaStrategy";

export class SlaStrategyRegistry {
  private readonly strategies = new Map<string, SlaStrategy>();
  private defaultStrategy?: SlaStrategy;

  register(customerType: string, strategy: SlaStrategy): this {
    this.strategies.set(customerType, strategy);
    return this;
  }

  setDefault(strategy: SlaStrategy): this {
    this.defaultStrategy = strategy;
    return this;
  }

  resolve(customerType: string): SlaStrategy {
    const strategy = this.strategies.get(customerType) ?? this.defaultStrategy;
    if (!strategy) {
      throw new Error(
        `No SlaStrategy registered for customerType='${customerType}', and no default strategy is configured.`,
      );
    }
    return strategy;
  }
}
