import { describe, expect, it } from '@jest/globals';
import { reasoningQuestions } from '../reasoning';

describe('reasoning question bank', () => {
  it('given the bank, when checking ids, then every id is unique', () => {
    const ids = reasoningQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(reasoningQuestions)('given question $id, when checking its answer, then it points to an existing option', (q) => {
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(q.answer).toBeGreaterThanOrEqual(0);
    expect(q.answer).toBeLessThan(q.options.length);
    expect(q.prompt.trim()).not.toBe('');
  });

  it.each(reasoningQuestions)('given question $id, when revealing the answer, then it carries an explanation', (q) => {
    expect(q.explanation.trim().length).toBeGreaterThan(20);
  });

  it.each(reasoningQuestions)('given question $id, when listing options, then none repeats', (q) => {
    expect(new Set(q.options).size).toBe(q.options.length);
  });

  it('given a quick round, when drawing questions, then the bank has enough of them', () => {
    expect(reasoningQuestions.length).toBeGreaterThanOrEqual(10);
  });
});
