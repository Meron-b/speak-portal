# Speak full-stack take-home assessment

## Welcome

Thank you for your interest in Speak! We’re excited to have you in our interview process and hope you have a great experience.

This document outlines the details and guidelines for Speak’s full-stack take-home assessment.

## Project overview

You’ll build a miniature language learning portal: a simple web application where users can browse courses, view lessons, and simulate recording/transcribing speech for a lesson.

- Aim to spend less than four hours on this exercise
- Use technologies and frameworks you are most comfortable with
- Persist data via a lightweight database or JSON files
- Feel encouraged to leverage AI tooling to efficiently deliver a solution

## Requirements

### Pages

- A page presenting a list of available courses
- A page presenting the details and lessons for a single course
- A page presenting the details for a single lesson and a _Record_ button

_Note: each page should be designed to support only mobile viewports; they do not need to responsively scale up for wide screens._

#### Recording experience

- Simulate sending audio chunks to the backend via WebSocket
- Simulate real-time updates to display transcribed text as it streams in

<!-- Todo: embed a video or gif of this experience -->

## Provided assets

### Frontend data

- [`audio.json`](/assets/audio.json) contains simulated recorded audio chunks

### Backend data

- [`course.json`](/assets/course.json) contains an enumerable of course entities that exist in the system
- [`transcriptions.json`](/assets/transcriptions.json) contains the corresponding transcribed text for each audio chunk

_Note: Feel free to modify the file type and syntax to align with your chosen technologies._

## Evaluation criteria

- Architecture and code quality
- Code readability and maintainability
- API design
- Real-time communication
- User experience

### Non-goals

Do not feel obligated to invest effort in the following deliverables:

- Automated tests
- User authentication
- Containerization / CI
- Dark mode support

## Onsite presentation

Your take-home project will be a key discussion topic during your onsite interview. Be prepared to discuss:

- Decisions regarding architecture, design, and implementation
- Challenges faced and how you solved them
- Features or improvements you would add with more time

## Getting started

1. Fork and clone [this repository](https://github.com/usespeakeasy/full-stack-take-home-assessment)

    ```bash
    gh repo fork usespeakeasy/full-stack-take-home-assessment --clone
    ```

1. Update your forked repository visibility to `private`

    ```bash
    gh repo edit <your-username>/full-stack-take-home-assessment --visibility private --accept-visibility-change-consequences
    ```

1. Complete your work in your forked repository
1. Add a section to the `README` describing how to run the application locally
1. Add `tc`, `jerrypopsoff`, and `ngamolsky` as collaborators to your fork:

    ```bash
    gh repo add-collaborator <your-username>/full-stack-take-home-assessment tc
    gh repo add-collaborator <your-username>/full-stack-take-home-assessment jerrypopsoff
    gh repo add-collaborator <your-username>/full-stack-take-home-assessment ngamolsky
    ```

1. Send the link to your fork to your recruiter

## Questions or need help?

If you have any questions or need clarification at any point during the take-home, please email your recruiter. They will make sure your question reaches our team, and we will get back to you as soon as possible.

We want you to feel supported throughout the process—no question is too small!

---

Good luck! We look forward to reviewing your work. 🚀
