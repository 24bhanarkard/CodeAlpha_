import { Quote, QuoteCategory } from '../types';

export const QUOTES: Quote[] = [
  // Wisdom & Philosophy
  {
    id: 'q1',
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    category: 'Philosophy',
    context: 'Classical Greek philosopher'
  },
  {
    id: 'q2',
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    category: 'Perseverance',
    context: 'Theoretical physicist'
  },
  {
    id: 'q3',
    text: 'Creativity is intelligence having fun.',
    author: 'Albert Einstein',
    category: 'Creativity',
    context: 'Theoretical physicist'
  },
  {
    id: 'q4',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: 'Perseverance',
    context: 'Ancient Chinese philosopher'
  },
  {
    id: 'q5',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'Courage',
    context: 'Diplomat & activist'
  },
  {
    id: 'q6',
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
    category: 'Creativity',
    context: 'Polymath & artist'
  },
  {
    id: 'q7',
    text: 'You must be the change you wish to see in the world.',
    author: 'Mahatma Gandhi',
    category: 'Leadership',
    context: 'Civil rights leader'
  },
  {
    id: 'q8',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Will Durant',
    category: 'Success',
    context: 'Historian & philosopher (on Aristotle)'
  },
  {
    id: 'q9',
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    category: 'Mindfulness',
    context: 'Spiritual teacher'
  },
  {
    id: 'q10',
    text: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
    category: 'Courage',
    context: '26th U.S. President'
  },
  {
    id: 'q11',
    text: 'He who has a why to live can bear almost any how.',
    author: 'Friedrich Nietzsche',
    category: 'Philosophy',
    context: 'German philosopher'
  },
  {
    id: 'q12',
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    category: 'Innovation',
    context: 'Computer scientist & pioneer'
  },
  {
    id: 'q13',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'Courage',
    context: 'British Prime Minister'
  },
  {
    id: 'q14',
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
    category: 'Philosophy',
    context: 'Classical Greek philosopher'
  },
  {
    id: 'q15',
    text: 'Your time is limited, so don’t waste it living someone else’s life.',
    author: 'Steve Jobs',
    category: 'Courage',
    context: 'Co-founder of Apple'
  },
  {
    id: 'q16',
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: 'Mindfulness',
    context: 'Spiritual teacher'
  },
  {
    id: 'q17',
    text: 'The secret of change is to focus all of your energy not on fighting the old, but on building the new.',
    author: 'Dan Millman',
    category: 'Wisdom',
    context: 'Author & lecturer'
  },
  {
    id: 'q18',
    text: 'An unexamined life is not worth living, but an unlived life is not worth examining.',
    author: 'Joseph Campbell',
    category: 'Philosophy',
    context: 'Mythologist & writer'
  },
  {
    id: 'q19',
    text: 'You cannot step into the same river twice, for other waters are continually flowing on.',
    author: 'Heraclitus',
    category: 'Philosophy',
    context: 'Pre-Socratic philosopher'
  },
  {
    id: 'q20',
    text: 'Everything has beauty, but not everyone sees it.',
    author: 'Confucius',
    category: 'Wisdom',
    context: 'Ancient Chinese philosopher'
  },
  {
    id: 'q21',
    text: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.',
    author: 'Ralph Waldo Emerson',
    category: 'Courage',
    context: 'Essayist & poet'
  },
  {
    id: 'q22',
    text: 'Wisdom begins in wonder.',
    author: 'Socrates',
    category: 'Wisdom',
    context: 'Classical Greek philosopher'
  },
  {
    id: 'q23',
    text: 'Action is the foundational key to all success.',
    author: 'Pablo Picasso',
    category: 'Success',
    context: 'Spanish painter & sculptor'
  },
  {
    id: 'q24',
    text: 'Real change, enduring change, happens one step at a time.',
    author: 'Ruth Bader Ginsburg',
    category: 'Leadership',
    context: 'U.S. Supreme Court Justice'
  },
  {
    id: 'q25',
    text: 'I have not failed. I’ve just found 10,000 ways that won’t work.',
    author: 'Thomas Edison',
    category: 'Perseverance',
    context: 'Inventor & businessman'
  },
  {
    id: 'q26',
    text: 'Life isn’t about finding yourself. Life is about creating yourself.',
    author: 'George Bernard Shaw',
    category: 'Creativity',
    context: 'Playwright & critic'
  },
  {
    id: 'q27',
    text: 'The journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    category: 'Perseverance',
    context: 'Ancient Chinese philosopher'
  },
  {
    id: 'q28',
    text: 'Never let the fear of striking out keep you from playing the game.',
    author: 'Babe Ruth',
    category: 'Courage',
    context: 'Legendary baseball player'
  },
  {
    id: 'q29',
    text: 'Turn your wounds into wisdom.',
    author: 'Oprah Winfrey',
    category: 'Wisdom',
    context: 'Media leader & philanthropist'
  },
  {
    id: 'q30',
    text: 'What we achieve inwardly will change outer reality.',
    author: 'Plutarch',
    category: 'Mindfulness',
    context: 'Greek historian & biographer'
  },
  {
    id: 'q31',
    text: 'A leader is one who knows the way, goes the way, and shows the way.',
    author: 'John C. Maxwell',
    category: 'Leadership',
    context: 'Author & speaker'
  },
  {
    id: 'q32',
    text: 'Art is the lie that enables us to realize the truth.',
    author: 'Pablo Picasso',
    category: 'Creativity',
    context: 'Spanish painter & sculptor'
  },
  {
    id: 'q33',
    text: 'Doubt is the origin of wisdom.',
    author: 'René Descartes',
    category: 'Philosophy',
    context: 'French philosopher & mathematician'
  },
  {
    id: 'q34',
    text: 'The only limit to our realization of tomorrow will be our doubts of today.',
    author: 'Franklin D. Roosevelt',
    category: 'Success',
    context: '32nd U.S. President'
  },
  {
    id: 'q35',
    text: 'If you want to lift yourself up, lift up someone else.',
    author: 'Booker T. Washington',
    category: 'Compassion',
    context: 'Educator & reformer'
  },
  {
    id: 'q36',
    text: 'Knowing others is intelligence; knowing yourself is true wisdom.',
    author: 'Lao Tzu',
    category: 'Wisdom',
    context: 'Ancient Chinese philosopher'
  },
  {
    id: 'q37',
    text: 'Nothing is impossible, the word itself says “I’m possible”!',
    author: 'Audrey Hepburn',
    category: 'Courage',
    context: 'Actress & humanitarian'
  },
  {
    id: 'q38',
    text: 'Present moment, wonderful moment.',
    author: 'Thích Nhất Hạnh',
    category: 'Mindfulness',
    context: 'Zen Buddhist master & peace activist'
  },
  {
    id: 'q39',
    text: 'Great things are done by a series of small things brought together.',
    author: 'Vincent van Gogh',
    category: 'Creativity',
    context: 'Post-impressionist painter'
  },
  {
    id: 'q40',
    text: 'Happiness depends upon ourselves.',
    author: 'Aristotle',
    category: 'Philosophy',
    context: 'Ancient Greek philosopher'
  },

  // Gratitude & Compassion
  {
    id: 'q41',
    text: 'Gratitude turns what we have into enough, and more.',
    author: 'Melody Beattie',
    category: 'Gratitude',
    context: 'Author & counselor'
  },
  {
    id: 'q42',
    text: 'Silent gratitude isn’t much use to anyone.',
    author: 'Gertrude Stein',
    category: 'Gratitude',
    context: 'Novelist & poet'
  },
  {
    id: 'q43',
    text: 'If your compassion does not include yourself, it is incomplete.',
    author: 'Jack Kornfield',
    category: 'Compassion',
    context: 'Buddhist teacher & psychologist'
  },
  {
    id: 'q44',
    text: 'No act of kindness, no matter how small, is ever wasted.',
    author: 'Aesop',
    category: 'Compassion',
    context: 'Ancient Greek storyteller'
  },
  {
    id: 'q45',
    text: 'When we give cheerfully and accept gratefully, everyone is blessed.',
    author: 'Maya Angelou',
    category: 'Gratitude',
    context: 'Poet & civil rights activist'
  },
  {
    id: 'q46',
    text: 'Love and compassion are necessities, not luxuries. Without them, humanity cannot survive.',
    author: 'Dalai Lama',
    category: 'Compassion',
    context: 'Spiritual leader'
  },

  // Resilience & Perseverance
  {
    id: 'q47',
    text: 'The oak fought the wind and was broken, the willow bent when it must and survived.',
    author: 'Robert Jordan',
    category: 'Resilience',
    context: 'Fantasy author'
  },
  {
    id: 'q48',
    text: 'Although the world is full of suffering, it is also full of the overcoming of it.',
    author: 'Helen Keller',
    category: 'Resilience',
    context: 'Author & disability rights advocate'
  },
  {
    id: 'q49',
    text: 'Fall seven times, stand up eight.',
    author: 'Japanese Proverb',
    category: 'Resilience',
    context: 'Traditional wisdom'
  },
  {
    id: 'q50',
    text: 'Strength does not come from winning. Your struggles develop your strengths.',
    author: 'Arnold Schwarzenegger',
    category: 'Perseverance',
    context: 'Statesman & champion'
  },
  {
    id: 'q51',
    text: 'When the roots are deep, there is no reason to fear the wind.',
    author: 'African Proverb',
    category: 'Resilience',
    context: 'Traditional wisdom'
  },
  {
    id: 'q52',
    text: 'Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened.',
    author: 'Helen Keller',
    category: 'Resilience',
    context: 'Author & educator'
  },

  // Innovation & Vision
  {
    id: 'q53',
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    category: 'Innovation',
    context: 'Co-founder of Apple'
  },
  {
    id: 'q54',
    text: 'The true sign of intelligence is not knowledge but imagination.',
    author: 'Albert Einstein',
    category: 'Innovation',
    context: 'Theoretical physicist'
  },
  {
    id: 'q55',
    text: 'Any sufficiently advanced technology is indistinguishable from magic.',
    author: 'Arthur C. Clarke',
    category: 'Innovation',
    context: 'Science fiction writer & futurist'
  },
  {
    id: 'q56',
    text: 'The measure of intelligence is the ability to change.',
    author: 'Albert Einstein',
    category: 'Innovation',
    context: 'Theoretical physicist'
  },
  {
    id: 'q57',
    text: 'If you want something new, you have to stop doing something old.',
    author: 'Peter Drucker',
    category: 'Innovation',
    context: 'Management consultant & educator'
  },
  {
    id: 'q58',
    text: 'Discovery consists of seeing what everybody has seen and thinking what nobody has thought.',
    author: 'Albert Szent-Györgyi',
    category: 'Innovation',
    context: 'Nobel Prize biochemist'
  },

  // Mindfulness & Serenity
  {
    id: 'q59',
    text: 'Smile, breathe and go slowly.',
    author: 'Thích Nhất Hạnh',
    category: 'Mindfulness',
    context: 'Zen Buddhist master'
  },
  {
    id: 'q60',
    text: 'Nature does not hurry, yet everything is accomplished.',
    author: 'Lao Tzu',
    category: 'Mindfulness',
    context: 'Ancient philosopher'
  },
  {
    id: 'q61',
    text: 'In the stillness of the mind, I saw by looking inward that which is impossible to see looking outward.',
    author: 'Rumi',
    category: 'Mindfulness',
    context: '13th-century Persian poet & mystic'
  },
  {
    id: 'q62',
    text: 'The quieter you become, the more you are able to hear.',
    author: 'Rumi',
    category: 'Mindfulness',
    context: 'Sufi mystic & poet'
  },
  {
    id: 'q63',
    text: 'Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.',
    author: 'Hermann Hesse',
    category: 'Mindfulness',
    context: 'Nobel Prize author'
  },
  {
    id: 'q64',
    text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',
    author: 'Thích Nhất Hạnh',
    category: 'Mindfulness',
    context: 'Zen master'
  },

  // Creativity & Expression
  {
    id: 'q65',
    text: 'You can’t use up creativity. The more you use, the more you have.',
    author: 'Maya Angelou',
    category: 'Creativity',
    context: 'Poet & author'
  },
  {
    id: 'q66',
    text: 'Every child is an artist. The problem is how to remain an artist once we grow up.',
    author: 'Pablo Picasso',
    category: 'Creativity',
    context: 'Painter & pioneer of cubism'
  },
  {
    id: 'q67',
    text: 'To create one’s own world in any of the arts takes courage.',
    author: 'Georgia O’Keeffe',
    category: 'Creativity',
    context: 'Modernist painter'
  },
  {
    id: 'q68',
    text: 'Have no fear of perfection — you’ll never reach it.',
    author: 'Salvador Dalí',
    category: 'Creativity',
    context: 'Surrealist artist'
  },
  {
    id: 'q69',
    text: 'The chief enemy of creativity is good sense.',
    author: 'Pablo Picasso',
    category: 'Creativity',
    context: 'Artist'
  },
  {
    id: 'q70',
    text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
    author: 'Ralph Waldo Emerson',
    category: 'Creativity',
    context: 'Philosopher & essayist'
  },

  // Courage & Bravery
  {
    id: 'q71',
    text: 'I learned that courage was not the absence of fear, but the triumph over it.',
    author: 'Nelson Mandela',
    category: 'Courage',
    context: 'Anti-apartheid leader & Nobel laureate'
  },
  {
    id: 'q72',
    text: 'It takes courage to grow up and become who you really are.',
    author: 'E.E. Cummings',
    category: 'Courage',
    context: 'Poet & playwright'
  },
  {
    id: 'q73',
    text: 'Bravery is not the absence of fear. Bravery is feeling fear and doing it anyway.',
    author: 'Brené Brown',
    category: 'Courage',
    context: 'Researcher & storyteller'
  },
  {
    id: 'q74',
    text: 'Only those who dare to fail greatly can ever achieve greatly.',
    author: 'Robert F. Kennedy',
    category: 'Courage',
    context: 'U.S. Attorney General & Senator'
  },
  {
    id: 'q75',
    text: 'Courage is grace under pressure.',
    author: 'Ernest Hemingway',
    category: 'Courage',
    context: 'Nobel Prize novelist'
  },
  {
    id: 'q76',
    text: 'The most courageous act is still to think for yourself. Aloud.',
    author: 'Coco Chanel',
    category: 'Courage',
    context: 'Fashion designer & innovator'
  },

  // Leadership & Service
  {
    id: 'q77',
    text: 'The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.',
    author: 'Ronald Reagan',
    category: 'Leadership',
    context: '40th U.S. President'
  },
  {
    id: 'q78',
    text: 'As we look ahead into the next century, leaders will be those who empower others.',
    author: 'Bill Gates',
    category: 'Leadership',
    context: 'Co-founder of Microsoft & philanthropist'
  },
  {
    id: 'q79',
    text: 'Leadership is the capacity to translate vision into reality.',
    author: 'Warren Bennis',
    category: 'Leadership',
    context: 'Pioneer of contemporary leadership studies'
  },
  {
    id: 'q80',
    text: 'To handle yourself, use your head; to handle others, use your heart.',
    author: 'Eleanor Roosevelt',
    category: 'Leadership',
    context: 'First Lady & human rights pioneer'
  },
  {
    id: 'q81',
    text: 'The supreme quality for leadership is unquestionably integrity.',
    author: 'Dwight D. Eisenhower',
    category: 'Leadership',
    context: '34th U.S. President & General'
  },
  {
    id: 'q82',
    text: 'Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.',
    author: 'Jack Welch',
    category: 'Leadership',
    context: 'Business executive & author'
  },

  // Success & Mastery
  {
    id: 'q83',
    text: 'Success usually comes to those who are too busy to be looking for it.',
    author: 'Henry David Thoreau',
    category: 'Success',
    context: 'Transcendentalist philosopher & naturalist'
  },
  {
    id: 'q84',
    text: 'There are no secrets to success. It is the result of preparation, hard work, and learning from failure.',
    author: 'Colin Powell',
    category: 'Success',
    context: 'U.S. Secretary of State & General'
  },
  {
    id: 'q85',
    text: 'The secret of success is to do the common thing uncommonly well.',
    author: 'John D. Rockefeller Jr.',
    category: 'Success',
    context: 'Financier & philanthropist'
  },
  {
    id: 'q86',
    text: 'Success is getting what you want; happiness is wanting what you get.',
    author: 'W.P. Kinsella',
    category: 'Success',
    context: 'Novelist'
  },
  {
    id: 'q87',
    text: 'Opportunities don’t happen. You create them.',
    author: 'Chris Grosser',
    category: 'Success',
    context: 'Entrepreneur'
  },
  {
    id: 'q88',
    text: 'Don’t watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
    category: 'Success',
    context: 'Writer & educator'
  },

  // Philosophy & Deep Reflection
  {
    id: 'q89',
    text: 'Waste no more time arguing what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    context: 'Roman Emperor & Stoic philosopher'
  },
  {
    id: 'q90',
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    context: 'Meditations'
  },
  {
    id: 'q91',
    text: 'We suffer more often in imagination than in reality.',
    author: 'Seneca',
    category: 'Philosophy',
    context: 'Stoic philosopher & statesman'
  },
  {
    id: 'q92',
    text: 'Man is not affected by events, but by the view he takes of them.',
    author: 'Epictetus',
    category: 'Philosophy',
    context: 'Stoic sage'
  },
  {
    id: 'q93',
    text: 'To live is the rarest thing in the world. Most people exist, that is all.',
    author: 'Oscar Wilde',
    category: 'Philosophy',
    context: 'Playwright & poet'
  },
  {
    id: 'q94',
    text: 'The soul becomes dyed with the color of its thoughts.',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    context: 'Roman Stoic philosopher'
  },

  // Wisdom & Harmony
  {
    id: 'q95',
    text: 'The only good is knowledge and the only evil is ignorance.',
    author: 'Socrates',
    category: 'Wisdom',
    context: 'Classical Greek philosopher'
  },
  {
    id: 'q96',
    text: 'In three words I can sum up everything I’ve learned about life: it goes on.',
    author: 'Robert Frost',
    category: 'Wisdom',
    context: 'Poet'
  },
  {
    id: 'q97',
    text: 'Count your age by friends, not years. Count your life by smiles, not tears.',
    author: 'John Lennon',
    category: 'Wisdom',
    context: 'Musician & peace advocate'
  },
  {
    id: 'q98',
    text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    author: 'Rumi',
    category: 'Wisdom',
    context: '13th-century Sufi poet'
  },
  {
    id: 'q99',
    text: 'Be like water making its way through cracks. Adjust to the object, and you shall find a way round or through it.',
    author: 'Bruce Lee',
    category: 'Wisdom',
    context: 'Philosopher & martial artist'
  },
  {
    id: 'q100',
    text: 'The cave you fear to enter holds the treasure you seek.',
    author: 'Joseph Campbell',
    category: 'Wisdom',
    context: 'Mythologist & scholar'
  },
  {
    id: 'q101',
    text: 'Let the beauty of what you love be what you do.',
    author: 'Rumi',
    category: 'Creativity',
    context: 'Poet & mystic'
  },
  {
    id: 'q102',
    text: 'When one door of happiness closes, another opens; but often we look so long at the closed door that we do not see the one which has been opened for us.',
    author: 'Helen Keller',
    category: 'Gratitude',
    context: 'Author & activist'
  },
  {
    id: 'q103',
    text: 'No matter what people tell you, words and ideas can change the world.',
    author: 'Robin Williams',
    category: 'Courage',
    context: 'Dead Poets Society'
  },
  {
    id: 'q104',
    text: 'Look deep into nature, and then you will understand everything better.',
    author: 'Albert Einstein',
    category: 'Mindfulness',
    context: 'Physicist'
  },
  {
    id: 'q105',
    text: 'Keep your face always toward the sunshine—and shadows will fall behind you.',
    author: 'Walt Whitman',
    category: 'Perseverance',
    context: 'Poet'
  }
];

export const CATEGORIES = [
  'All',
  'Wisdom',
  'Creativity',
  'Courage',
  'Perseverance',
  'Philosophy',
  'Success',
  'Mindfulness',
  'Leadership',
  'Gratitude',
  'Resilience',
  'Compassion',
  'Innovation'
] as const;

export type CategoryName = typeof CATEGORIES[number];
