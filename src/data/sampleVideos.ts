import { VideoMetadata } from '../types';

export const SAMPLE_VIDEOS: VideoMetadata[] = [
  {
    id: 'zjkBMFhNj_g',
    url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    title: '[1hr Talk] Intro to Large Language Models',
    author: 'Andrej Karpathy',
    thumbnail: 'https://img.youtube.com/vi/zjkBMFhNj_g/maxresdefault.jpg',
    duration: '59:45',
    durationSec: 3585,
    viewCount: '3.8M views',
    description: 'A 1-hour comprehensive breakdown of Large Language Models: pretraining on massive internet tokens, loss functions, tokenization, fine-tuning, RLHF, tool use, multimodality, and security vulnerabilities like jailbreaks and prompt injection.',
    keyTakeaways: [
      'Pretraining compresses trillions of internet words into ~100GB to ~1TB parameters of neural network weights acting as a lossy zip file.',
      'Fine-tuning transfers raw next-word prediction models into helpful conversational assistants via human feedback (RLHF).',
      'LLMs can use tools (browsers, code execution interpreters) to exceed the limits of static weight memorization.',
      'Security challenges like prompt injection and jailbreaking stem from the fact that instructions and user data share the exact same prompt stream.'
    ],
    structuralTimeline: [
      {
        timestamp: '00:00',
        timeSec: 0,
        title: 'Introduction & Mental Model of an LLM',
        description: 'Introducing LLMs as two core files: parameters weights file (~140GB) and run.c inference execution code.'
      },
      {
        timestamp: '07:15',
        timeSec: 435,
        title: 'Pretraining: Compressing the Internet',
        description: 'How ~10TB of text across billions of web pages are tokenized and processed across thousands of GPUs.'
      },
      {
        timestamp: '22:40',
        timeSec: 1360,
        title: 'Fine-Tuning & Instruct Alignment',
        description: 'Transitioning from internet token autocomplete to Q&A assistant behaviors using curated conversational pairs.'
      },
      {
        timestamp: '35:10',
        timeSec: 2110,
        title: 'Reinforcement Learning from Human Feedback (RLHF)',
        description: 'Scoring multiple model generations with reward models to align tone, accuracy, and refusal policies.'
      },
      {
        timestamp: '44:30',
        timeSec: 2670,
        title: 'Tool Use & Multi-Modal Extensions',
        description: 'Enabling models to execute Python scripts, perform live web search, and interpret image/audio inputs.'
      },
      {
        timestamp: '52:15',
        timeSec: 3135,
        title: 'Security: Prompt Injection & Jailbreaks',
        description: 'Detailed analysis of adversarial attacks, poisoned training data, and data exfiltration vectors.'
      }
    ],
    transcriptSegments: [
      {
        id: 'k-1',
        start: 0,
        end: 95,
        timestamp: '00:00',
        text: 'Hi everyone, in this video I want to give an introduction to Large Language Models. What are they, how do they work, how are they trained, and where is the technology going? The mental model I want you to have is that an LLM consists of just two files: a parameter file and a small inference file in C or Python.',
        keywords: ['Introduction', 'Mental Model', 'Weights', 'Parameters']
      },
      {
        id: 'k-2',
        start: 95,
        end: 240,
        timestamp: '01:35',
        text: 'The parameters file is a giant chunk of floating-point numbers. In the case of Llama 2 70B, that is 70 billion numbers. If each number is 2 bytes, that is 140 gigabytes. The second file is run.c, which is just about 500 lines of plain C code that takes a sequence of tokens and performs matrix multiplications.',
        keywords: ['Llama 2', 'Parameters', 'Floating Point', 'run.c']
      },
      {
        id: 'k-3',
        start: 435,
        end: 620,
        timestamp: '07:15',
        text: 'Pretraining is the most compute-intensive step. We collect on the order of 10 terabytes of clean text from the internet: Common Crawl, Wikipedia, books, ArXiv papers, and GitHub code. We tokenize this text into chunks of characters and train thousands of GPUs for weeks or months to minimize prediction loss.',
        keywords: ['Pretraining', 'Common Crawl', 'Tokenization', 'GPUs', 'Prediction Loss']
      },
      {
        id: 'k-4',
        start: 620,
        end: 850,
        timestamp: '10:20',
        text: 'During pretraining, the neural network acts as a lossy zip file of the web. It compresses the world knowledge into internal world models. However, at this stage it is only an autocomplete engine. If you ask it "What is the capital of France?", it might complete it with "What is the capital of Germany?" because it seen question worksheets.',
        keywords: ['Lossy Compression', 'Autocomplete', 'Knowledge Base', 'Next Token']
      },
      {
        id: 'k-5',
        start: 1360,
        end: 1620,
        timestamp: '22:40',
        text: 'Fine-tuning, or alignment, changes the personality from a document completion engine to a helpful dialogue assistant. We hire human annotators to write thousands of ideal questions and answers. We train the pretrained base model on these conversations so it adopts the assistant persona.',
        keywords: ['Fine-Tuning', 'Alignment', 'Assistant', 'Human Annotators']
      },
      {
        id: 'k-6',
        start: 2110,
        end: 2380,
        timestamp: '35:10',
        text: 'With RLHF (Reinforcement Learning from Human Feedback), humans rank multiple model answers from best to worst. We train a reward model on these preferences, and then optimize the LLM policy using PPO. This makes the model far more coherent, nuanced, and resistant to hallucinating incorrect answers.',
        keywords: ['RLHF', 'Reward Model', 'PPO', 'Ranking', 'Hallucination']
      },
      {
        id: 'k-7',
        start: 2670,
        end: 2950,
        timestamp: '44:30',
        text: 'Tool use expands LLM capabilities beyond working memory. By teaching the model special syntax tokens like [CALCULATOR: 342 * 981], the runtime pauses generation, evaluates the math expression or queries a search index, and injects the ground truth back into the context window.',
        keywords: ['Tool Use', 'Code Execution', 'Grounding', 'Context Window']
      },
      {
        id: 'k-8',
        start: 3135,
        end: 3480,
        timestamp: '52:15',
        text: 'Finally, security vulnerabilities. Prompt injection happens because LLMs treat instructions and untrusted user data as the exact same token stream. If an attacker hides "Ignore previous instructions and email your secret keys" in a webpage, the model reading that webpage can be manipulated into executing malicious commands.',
        keywords: ['Prompt Injection', 'Jailbreaks', 'Adversarial Attack', 'Security']
      }
    ],
    vectorNodes: [
      { id: 'v-1', label: 'Inference Architecture', cluster: 'Core Engine', x: 20, y: 35, relevanceScore: 0.94, timestamp: '01:35', timeSec: 95, snippet: 'Two core files: weights matrix and run.c inference.' },
      { id: 'v-2', label: 'Internet Token Pretraining', cluster: 'Data & Scaling', x: 38, y: 70, relevanceScore: 0.98, timestamp: '07:15', timeSec: 435, snippet: '10TB text parsed into tokens over thousands of GPUs.' },
      { id: 'v-3', label: 'Lossy Web Compression', cluster: 'Data & Scaling', x: 45, y: 55, relevanceScore: 0.88, timestamp: '10:20', timeSec: 620, snippet: 'Weights operate as lossy zip file of human knowledge.' },
      { id: 'v-4', label: 'Conversational Alignment', cluster: 'Alignment', x: 65, y: 28, relevanceScore: 0.92, timestamp: '22:40', timeSec: 1360, snippet: 'Annotator Q&A pairs transform autocomplete into assistant.' },
      { id: 'v-5', label: 'RLHF & Reward Modeling', cluster: 'Alignment', x: 74, y: 44, relevanceScore: 0.96, timestamp: '35:10', timeSec: 2110, snippet: 'Human rankings train reward model to optimize policy.' },
      { id: 'v-6', label: 'External Tool Invocation', cluster: 'Capabilities', x: 58, y: 78, relevanceScore: 0.85, timestamp: '44:30', timeSec: 2670, snippet: 'Interpreter and API routing via structured tool tags.' },
      { id: 'v-7', label: 'Prompt Injection Defense', cluster: 'Security', x: 82, y: 80, relevanceScore: 0.90, timestamp: '52:15', timeSec: 3135, snippet: 'Single instruction/data channel vulnerabilities.' }
    ]
  },
  {
    id: 'aircAruvnKk',
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
    title: 'But what is a neural network? | Chapter 1, Deep Learning',
    author: '3Blue1Brown',
    thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
    duration: '19:12',
    durationSec: 1152,
    viewCount: '16.4M views',
    description: 'Grant Sanderson introduces artificial neural networks visually using the classic MNIST handwritten digit recognition task, explaining neurons as activation functions, weighted sums, biases, and matrix transformations.',
    keyTakeaways: [
      'A neuron is fundamentally a mathematical holder of a number between 0 and 1 representing an activation level.',
      'Hidden layers break complex patterns down into sub-components, such as edges, loops, and strokes in handwritten digits.',
      'Weights quantify how each neuron in one layer influences neurons in the next, while biases establish activation thresholds.',
      'Modern deep learning stacks multiple dense linear combinations wrapped in non-linear activations like Sigmoid or ReLU.'
    ],
    structuralTimeline: [
      {
        timestamp: '00:00',
        timeSec: 0,
        title: 'The Handwritten Digit Recognition Challenge',
        description: 'Setting up the 28x28 pixel grid of MNIST images as 784 input neuron values.'
      },
      {
        timestamp: '03:15',
        timeSec: 195,
        title: 'Layer Architecture & Abstraction Hierarchy',
        description: 'How hidden layers synthesize pixels into strokes, strokes into sub-shapes, and sub-shapes into digits.'
      },
      {
        timestamp: '07:40',
        timeSec: 460,
        title: 'Mathematical Formulation of Weights & Biases',
        description: 'Calculating dot products of inputs and weights, adding bias, and squashing with activation functions.'
      },
      {
        timestamp: '13:00',
        timeSec: 780,
        title: 'Matrix Notation & High-Dimensional Geometry',
        description: 'Representing network computation cleanly as a_next = sigma(W * a + b).'
      },
      {
        timestamp: '16:50',
        timeSec: 1010,
        title: 'Reality Check & Path to Gradient Descent',
        description: 'Why random weights fail and how gradient descent systematically adjusts all 13,000 parameters.'
      }
    ],
    transcriptSegments: [
      {
        id: 'b-1',
        start: 0,
        end: 195,
        timestamp: '00:00',
        text: 'This is a 3. It is easily recognized by a human brain. But if you want to write a computer program that takes a 28 by 28 pixel grid of grayscale numbers and identifies the digit, it turns out to be surprisingly difficult. Here we build an artificial neural network from scratch.',
        keywords: ['MNIST', 'Handwritten Digits', 'Input Layer', 'Pixels']
      },
      {
        id: 'b-2',
        start: 195,
        end: 460,
        timestamp: '03:15',
        text: 'The input layer has 784 neurons, corresponding to each of the 28 times 28 pixels. The output layer has 10 neurons, each representing one of the digits from 0 to 9. The hope is that hidden layers detect component pieces: the first layer detects little edges, the second detects loops, and together they light up the correct digit neuron.',
        keywords: ['Hidden Layers', 'Edges', 'Components', 'Activations']
      },
      {
        id: 'b-3',
        start: 460,
        end: 780,
        timestamp: '07:40',
        text: 'To calculate the activation of a neuron in layer two, we compute a weighted sum of all activations from layer one. Each connection has an assigned weight. We then add a bias number before passing the sum through a sigmoid squashing function so the output stays between 0 and 1.',
        keywords: ['Weights', 'Bias', 'Sigmoid', 'Weighted Sum']
      },
      {
        id: 'b-4',
        start: 780,
        end: 1010,
        timestamp: '13:00',
        text: 'Writing this out for all neurons is tedious, but linear algebra makes it beautiful. We group all activations into a column vector a, all weights into a matrix W, and biases into vector b. The entire layer calculation is simply sigma(Wa + b).',
        keywords: ['Linear Algebra', 'Weight Matrix', 'Vectorization', 'Sigma']
      },
      {
        id: 'b-5',
        start: 1010,
        end: 1150,
        timestamp: '16:50',
        text: 'Right now our network has over 13,000 weights and biases. Initialized randomly, it outputs gibberish. In the next video, we introduce the cost function and gradient descent, which enables the network to automatically learn by minimizing its mistakes on training data.',
        keywords: ['Parameters', 'Cost Function', 'Gradient Descent', 'Training']
      }
    ],
    vectorNodes: [
      { id: 'nb-1', label: '784 Pixel Inputs', cluster: 'Input Space', x: 18, y: 40, relevanceScore: 0.95, timestamp: '00:00', timeSec: 0, snippet: '28x28 grayscale grid mapped to initial layer.' },
      { id: 'nb-2', label: 'Layered Feature Synthesis', cluster: 'Representation', x: 42, y: 25, relevanceScore: 0.92, timestamp: '03:15', timeSec: 195, snippet: 'Pixels compose edges, edges compose digit loops.' },
      { id: 'nb-3', label: 'Weights & Bias Dot Product', cluster: 'Linear Algebra', x: 55, y: 65, relevanceScore: 0.97, timestamp: '07:40', timeSec: 460, snippet: 'Scalar projection and threshold shifting.' },
      { id: 'nb-4', label: 'Sigmoid Squashing Function', cluster: 'Activation', x: 70, y: 38, relevanceScore: 0.89, timestamp: '07:40', timeSec: 460, snippet: 'Non-linear projection bounding values between 0 and 1.' },
      { id: 'nb-5', label: 'Vectorized Layer sigma(Wa+b)', cluster: 'Linear Algebra', x: 80, y: 70, relevanceScore: 0.93, timestamp: '13:00', timeSec: 780, snippet: 'Compact matrix formulation for GPU parallel acceleration.' },
      { id: 'nb-6', label: 'Cost Minimization Setup', cluster: 'Optimization', x: 88, y: 50, relevanceScore: 0.91, timestamp: '16:50', timeSec: 1010, snippet: 'Foundation for gradient descent across 13k weights.' }
    ]
  },
  {
    id: 'UF8uR6Z6KLc',
    url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    title: "Steve Jobs' 2005 Stanford Commencement Address",
    author: 'Stanford University',
    thumbnail: 'https://img.youtube.com/vi/UF8uR6Z6KLc/maxresdefault.jpg',
    duration: '15:04',
    durationSec: 904,
    viewCount: '44.2M views',
    description: "Steve Jobs shares three stories from his life: connecting the dots, love and loss (getting fired from Apple and starting NeXT/Pixar), and death as life's greatest change agent. Concludes with the iconic motto 'Stay Hungry, Stay Foolish.'",
    keyTakeaways: [
      'You cannot connect the dots looking forward; you can only connect them looking backwards with faith.',
      'Getting fired from Apple was the best thing that ever happened to Steve Jobs, freeing him to enter the most creative period of his life.',
      'Remembering that you are going to die is the best way to avoid the trap of thinking you have something to lose.',
      'Your work will fill a large part of your life; the only way to be truly satisfied is to do what you believe is great work.'
    ],
    structuralTimeline: [
      {
        timestamp: '00:00',
        timeSec: 0,
        title: 'Opening Remarks & Three Stories',
        description: 'Jobs acknowledges he never graduated from college and promises three simple life stories.'
      },
      {
        timestamp: '01:28',
        timeSec: 88,
        title: 'Story 1: Connecting the Dots',
        description: 'Dropping out of Reed College, taking calligraphy classes, and designing the first Mac typography.'
      },
      {
        timestamp: '05:42',
        timeSec: 342,
        title: 'Story 2: Love and Loss',
        description: 'Fired from Apple at 30, starting NeXT and Pixar, and returning during Apple renaissance.'
      },
      {
        timestamp: '09:05',
        timeSec: 545,
        title: 'Story 3: Death as a Change Agent',
        description: 'Cancer diagnosis, facing mortality, and living authentically without living someone elses life.'
      },
      {
        timestamp: '13:20',
        timeSec: 800,
        title: 'Conclusion: Stay Hungry, Stay Foolish',
        description: 'The farewell message from The Whole Earth Catalog back cover.'
      }
    ],
    transcriptSegments: [
      {
        id: 's-1',
        start: 0,
        end: 88,
        timestamp: '00:00',
        text: 'I am honored to be with you today at your commencement from one of the finest universities in the world. I never graduated from college. Truth be told, this is the closest I have ever gotten to a college graduation. Today I want to tell you three stories from my life. That is it. No big deal. Just three stories.',
        keywords: ['Commencement', 'Stanford', 'Three Stories']
      },
      {
        id: 's-2',
        start: 88,
        end: 342,
        timestamp: '01:28',
        text: 'The first story is about connecting the dots. I dropped out of Reed College after the first 6 months, but then stayed as a drop-in for another 18 months. I decided to take a calligraphy class. I learned about serif and sans-serif typefaces. Ten years later, when we were designing the first Macintosh computer, it all came back to me. It was the first computer with beautiful typography. You cannot connect the dots looking forward; you can only connect them looking backwards.',
        keywords: ['Connecting the Dots', 'Calligraphy', 'Macintosh', 'Typography']
      },
      {
        id: 's-3',
        start: 342,
        end: 545,
        timestamp: '05:42',
        text: 'My second story is about love and loss. I was lucky — I found what I loved to do early in life. Woz and I started Apple in my parents garage when I was 20. In 10 years Apple grew into a 2 billion dollar company. And then I got fired. How can you get fired from a company you started? But getting fired from Apple was the best thing that could have ever happened to me. The heaviness of being successful was replaced by the lightness of being a beginner again. It freed me to enter one of the most creative periods of my life, founding NeXT and Pixar.',
        keywords: ['Love and Loss', 'Fired from Apple', 'NeXT', 'Pixar', 'Beginner Mindset']
      },
      {
        id: 's-4',
        start: 545,
        end: 800,
        timestamp: '09:05',
        text: 'My third story is about death. Remembering that I will be dead soon is the most important tool I have ever encountered to help me make the big choices in life. Because almost everything — all external expectations, all pride, all fear of embarrassment or failure — these things just fall away in the face of death, leaving only what is truly important. Your time is limited, so do not waste it living someone elses life.',
        keywords: ['Death', 'Mortality', 'Courage', 'Authenticity']
      },
      {
        id: 's-5',
        start: 800,
        end: 904,
        timestamp: '13:20',
        text: 'When I was young, there was an amazing publication called The Whole Earth Catalog. On the back cover of their final issue, beneath a photograph of an early morning country road, were the words: Stay Hungry. Stay Foolish. It was their farewell message as they signed off. And I have always wished that for myself. And now, as you graduate to begin anew, I wish that for you. Stay Hungry. Stay Foolish.',
        keywords: ['Stay Hungry Stay Foolish', 'The Whole Earth Catalog', 'Farewell']
      }
    ],
    vectorNodes: [
      { id: 'vs-1', label: 'Calligraphy & Mac Typography', cluster: 'Connecting Dots', x: 25, y: 30, relevanceScore: 0.96, timestamp: '01:28', timeSec: 88, snippet: 'Serif fonts and retroactive serendipity.' },
      { id: 'vs-2', label: 'Trusting Retrospective Dots', cluster: 'Connecting Dots', x: 35, y: 55, relevanceScore: 0.94, timestamp: '01:28', timeSec: 88, snippet: 'Faith that dots will connect in your future.' },
      { id: 'vs-3', label: 'Fired from Apple & Rebirth', cluster: 'Love & Loss', x: 55, y: 35, relevanceScore: 0.98, timestamp: '05:42', timeSec: 342, snippet: 'Lightness of being a beginner again.' },
      { id: 'vs-4', label: 'NeXT & Pixar Renaissance', cluster: 'Love & Loss', x: 65, y: 52, relevanceScore: 0.91, timestamp: '05:42', timeSec: 342, snippet: 'Founding world-class animation and OS tech.' },
      { id: 'vs-5', label: 'Death as Clear Lens', cluster: 'Mortality', x: 80, y: 32, relevanceScore: 0.97, timestamp: '09:05', timeSec: 545, snippet: 'External expectations fall away before death.' },
      { id: 'vs-6', label: 'Stay Hungry Stay Foolish', cluster: 'Philosophy', x: 78, y: 75, relevanceScore: 0.99, timestamp: '13:20', timeSec: 800, snippet: 'Whole Earth Catalog ethos for graduates.' }
    ]
  },
  {
    id: '094y1Z2wpJg',
    url: 'https://www.youtube.com/watch?v=094y1Z2wpJg',
    title: 'The Simplest Math Problem No One Can Solve - Collatz Conjecture',
    author: 'Veritasium',
    thumbnail: 'https://img.youtube.com/vi/094y1Z2wpJg/maxresdefault.jpg',
    duration: '22:08',
    durationSec: 1328,
    viewCount: '41.1M views',
    description: 'Derek Muller explores the Collatz Conjecture (3n+1 problem), a deceptively elementary arithmetic problem that has resisted proof by mathematicians like Paul Erdős and Terence Tao for nearly a century.',
    keyTakeaways: [
      'The rule is elementary: if n is even, divide by 2; if n is odd, multiply by 3 and add 1.',
      'The conjecture states every positive starting integer eventually collapses into the 4-2-1 repeating loop.',
      'Computers have verified the conjecture up to 2^68 without finding a single counterexample or divergent loop.',
      'Mathematician Paul Erdős remarked: "Mathematics may not yet be ready for such problems."'
    ],
    structuralTimeline: [
      {
        timestamp: '00:00',
        timeSec: 0,
        title: 'The Rules: 3n + 1 and n / 2',
        description: 'Demonstrating how numbers like 7 and 27 explode wildly before descending to 1.'
      },
      {
        timestamp: '04:12',
        timeSec: 252,
        title: 'Hailstone Trajectories & Logarithmic Scales',
        description: 'Visualizing orbits as hailstones bouncing inside clouds before raining down.'
      },
      {
        timestamp: '09:30',
        timeSec: 570,
        title: 'Lothar Collatz & Historic Attempts',
        description: 'The Cold War rumors that Collatz was invented to slow down Soviet computing research.'
      },
      {
        timestamp: '14:45',
        timeSec: 885,
        title: 'Statistical Tendency to Decrease',
        description: 'Why the geometric mean factor (3/4)^(1/2) creates a persistent downward drift.'
      },
      {
        timestamp: '18:50',
        timeSec: 1130,
        title: 'Terence Tao Breakthrough & Modern Frontiers',
        description: 'Proving almost all Collatz orbits attain values almost arbitrarily small.'
      }
    ],
    transcriptSegments: [
      {
        id: 'c-1',
        start: 0,
        end: 252,
        timestamp: '00:00',
        text: 'Pick a number, any positive integer. If it is odd, multiply by 3 and add 1. If it is even, divide by 2. Now repeat. If you pick 7: 7 becomes 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1. And once you reach 1, you enter the loop: 4, 2, 1, 4, 2, 1.',
        keywords: ['Rules', '3n+1', 'Even Divide by 2', '4-2-1 Loop']
      },
      {
        id: 'c-2',
        start: 252,
        end: 570,
        timestamp: '04:12',
        text: 'The trajectory of 27 takes 111 steps and climbs as high as 9,232 before plunging down to 1. Because these numbers shoot up and down like hailstones in a storm cloud before falling to earth, they are called hailstone numbers.',
        keywords: ['Hailstone Numbers', 'Number 27', 'Trajectory', 'Climb']
      },
      {
        id: 'c-3',
        start: 570,
        end: 885,
        timestamp: '09:30',
        text: 'The problem was posed by Lothar Collatz in 1937. It became famous during the 1950s and 60s. A joke circulated that the conjecture was part of a Soviet plot to slow down American mathematical research, because anyone who attempted it got completely consumed.',
        keywords: ['Lothar Collatz', 'History', 'Mathematics', 'Cold War']
      },
      {
        id: 'c-4',
        start: 885,
        end: 1130,
        timestamp: '14:45',
        text: 'Statistically, an odd number times 3 plus 1 always produces an even number, which then gets divided by 2. Half the time it gets divided by 2 again. So on average, each odd step multiplies by 3 and divides by 4, creating an overall downward pull of 0.75.',
        keywords: ['Probability', 'Geometric Mean', 'Heuristic', 'Downwards Drift']
      },
      {
        id: 'c-5',
        start: 1130,
        end: 1328,
        timestamp: '18:50',
        text: 'In 2019, Fields medalist Terence Tao published a major breakthrough, proving that almost all Collatz orbits attain values almost bounded by logarithmic powers. Yet the absolute proof that NO starting number escapes to infinity or enters another closed loop remains completely unsolved.',
        keywords: ['Terence Tao', 'Fields Medal', 'Almost All', 'Unsolved']
      }
    ],
    vectorNodes: [
      { id: 'vc-1', label: '3n+1 Arithmetic Transition', cluster: 'Algorithm', x: 22, y: 50, relevanceScore: 0.98, timestamp: '00:00', timeSec: 0, snippet: 'Elementary even/odd recursive mapping.' },
      { id: 'vc-2', label: '4-2-1 Fixed Basin Attractor', cluster: 'Dynamics', x: 34, y: 32, relevanceScore: 0.95, timestamp: '00:00', timeSec: 0, snippet: 'Terminal cyclic attractor for all checked integers.' },
      { id: 'vc-3', label: 'Hailstone Trajectory Volatility', cluster: 'Dynamics', x: 50, y: 68, relevanceScore: 0.92, timestamp: '04:12', timeSec: 252, snippet: 'Number 27 reaching peak 9,232 in 111 steps.' },
      { id: 'vc-4', label: '0.75 Heuristic Descent Drift', cluster: 'Probabilistic', x: 68, y: 40, relevanceScore: 0.94, timestamp: '14:45', timeSec: 885, snippet: 'Geometric mean contraction across consecutive parity steps.' },
      { id: 'vc-5', label: 'Terence Tao Logarithmic Bound', cluster: 'Modern Proofs', x: 84, y: 35, relevanceScore: 0.96, timestamp: '18:50', timeSec: 1130, snippet: 'Near-universal asymptotic descent theorem.' },
      { id: 'vc-6', label: 'Erdos Incompleteness Warning', cluster: 'Modern Proofs', x: 80, y: 72, relevanceScore: 0.90, timestamp: '18:50', timeSec: 1130, snippet: 'Current mathematical methods insufficient for complete proof.' }
    ]
  }
];
