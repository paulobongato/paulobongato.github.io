# Quiz Creation Spec

Reference doc for requesting interactive HTML quizzes. Paste or link this when asking for a new quiz so the format stays consistent.

## Format
- **Output type:** Single self-contained HTML file (no external dependencies). NOT document or word format.
- **Language:** English or Filipino/Tagalog (unless specified otherwise), default is English reference if files are in english. Filipino if files are in Filipino.
- **Question type:** Multiple choice, A-D.
- **Question count:** Question bank is three times the number of questions. For example, a 15 question quiz has 45 question but only 15 are shown per attempt. One question at a time. Submit button after every question, showing the correct answer with an explanation after. Include a starting page with instructions and details and a start button before starting the quiz. 

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