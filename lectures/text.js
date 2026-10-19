// The text of a lecture as the page, the slides, and the follow-along notes show it: the view
// rules (🙈 slides, 🧑‍🏫 notes), without the numbered questions (those are the online refresher's),
// with the slides numbered 1.1, 1.2…
import { stripQuestions } from '../worksheet.js';
import { lectureView, numberSlides } from './view.js';

export const lectureText = (markdown, { instructor = false } = {}) => numberSlides(stripQuestions(lectureView(markdown, { instructor })));
