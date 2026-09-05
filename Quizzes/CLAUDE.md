# Quiz Creation Spec

Reference doc for requesting interactive HTML quizzes. Paste or link this when asking for a new quiz so the format stays consistent. NO WORD DOC.

## Format
- **Output type:** Single self-contained HTML file (no external dependencies). NOT document or word format.
- **Language:** English or Filipino/Tagalog (unless specified otherwise), default is English reference if files are in english. Filipino if files are in Filipino.
- **Question type:** Multiple choice, A-D. Make choices different position every attempt. It can also be true or false if easier. For math questions, it can be a text box that the user needs to input the right numerical value.
- **Question count:** Default questions is 20 unless specified. No question bank. But make sure important questions necessary to the topic are included. Make questions random order every attempt.
- **Question format:** Each question is one slide. Add a submit button per question and show correct answer per question with explanation.
- **Question start and end page:** Show a start button at the first page and instructions/details of the quiz. After finishing the quiz, show all incorrect answers and show correct answers.

## Required features
- **Randomization:** Question order shuffled on each load/attempt
- **Immediate feedback:** Show correct/incorrect right after each answer is selected (not just at the end). Need a submit button per question. One question shown at a time.
- **Score summary:** Final score shown at the end, show a summary of questions with mistakes and correct answer in the end.
- **Grade level:** Specify target grade (e.g., Grade 2, Grade 4). Default is Grade 4
- **Subject/topic:** Subject and topic of the quiz is based on the PDF, images, files or videos given.

## Style notes
- Clean, simple layout — readable for the target grade level
- Mobile-friendly (kids may use tablets/phones)
- Clear visual distinction between correct/incorrect feedback (e.g., green/red)

## Template request format
When requesting a new quiz, specify:
1. Subject
2. Grade level
3. Topic scope
4. Number of questions
5. Language (default: Filipino/Tagalog)
6. Any special requirements (images, matching type, timer, etc.)

---
**Example request:**
> Make a 15 question quiz from the PDF attached. Make it multiple choice A-B. Each attempt should make the questions random. Add a submit button per question and show correct answer per question with explanation. Show a start button at the first page and instructions/details of the quiz. After finishing the quiz, show all incorrect answers and show correct answers.