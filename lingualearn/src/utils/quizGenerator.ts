import { VocabularyItem, QuizQuestion, LanguageId, Category } from '../types';
import { LANGUAGES } from '../data/languages';

export function generateQuizQuestions(
  vocabulary: VocabularyItem[],
  languageId: LanguageId,
  count = 10,
  categoryFilter?: Category | 'All'
): QuizQuestion[] {
  const filteredVocab = categoryFilter && categoryFilter !== 'All'
    ? vocabulary.filter(v => v.category === categoryFilter)
    : vocabulary;

  if (filteredVocab.length === 0) return [];

  // Shuffle items
  const shuffledVocab = [...filteredVocab].sort(() => Math.random() - 0.5);
  const targetItems = shuffledVocab.slice(0, Math.min(count, shuffledVocab.length));
  const langName = LANGUAGES[languageId]?.name || 'the language';

  return targetItems.map((item, index) => {
    // Generate distinct distractors from the whole vocabulary pool
    const otherItems = vocabulary.filter(v => v.id !== item.id);
    const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);

    // Pick question template
    const questionType = index % 3; // 0: Foreign->English, 1: English->Foreign, 2: Phrase/Context

    if (questionType === 0) {
      // What does 'Hola' mean in English?
      const correctAnswer = item.translation;
      const wrongAnswers = shuffledOthers.slice(0, 3).map(o => o.translation);
      // Ensure unique options
      const options = Array.from(new Set([correctAnswer, ...wrongAnswers])).sort(() => Math.random() - 0.5);

      return {
        id: `q-${item.id}-${Date.now()}-${index}`,
        vocabularyId: item.id,
        questionType: 'meaning',
        prompt: `What is the English meaning of "${item.text}"?`,
        targetWord: item.text,
        pronunciation: item.pronunciation,
        options,
        correctAnswer,
        explanation: `"${item.text}" [${item.pronunciation}] means "${item.translation}".`,
        category: item.category,
      };
    } else if (questionType === 1) {
      // How do you say 'Thank you' in Spanish?
      const correctAnswer = item.text;
      const wrongAnswers = shuffledOthers.slice(0, 3).map(o => o.text);
      const options = Array.from(new Set([correctAnswer, ...wrongAnswers])).sort(() => Math.random() - 0.5);

      return {
        id: `q-${item.id}-${Date.now()}-${index}`,
        vocabularyId: item.id,
        questionType: 'translation',
        prompt: `How do you say "${item.translation}" in ${langName}?`,
        targetWord: item.text,
        pronunciation: item.pronunciation,
        options,
        correctAnswer,
        explanation: `In ${langName}, "${item.translation}" is "${item.text}" (pronounced: ${item.pronunciation}).`,
        category: item.category,
      };
    } else {
      // Meaning in context
      const correctAnswer = item.translation;
      const wrongAnswers = shuffledOthers.slice(0, 3).map(o => o.translation);
      const options = Array.from(new Set([correctAnswer, ...wrongAnswers])).sort(() => Math.random() - 0.5);

      return {
        id: `q-${item.id}-${Date.now()}-${index}`,
        vocabularyId: item.id,
        questionType: 'phrase_context',
        prompt: `Select the correct translation for the ${item.category.toLowerCase()} phrase: "${item.text}"`,
        targetWord: item.text,
        pronunciation: item.pronunciation,
        options,
        correctAnswer,
        explanation: `"${item.text}" translates to "${item.translation}". Example: ${item.exampleSentence}`,
        category: item.category,
      };
    }
  });
}
