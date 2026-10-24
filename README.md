# Python Study Compass

# Personalized Learning System

def personalized_learning():

    print("===== Personalized Learning System =====")

    student_name = input("Enter student name: ")

    topics = {

        "Python Basics": [],

        "Loops": [],

        "Functions": [],

        "Data Structures": []

    }

    # Collect student performance

    for topic in topics:

        print(f"\nTopic: {topic}")

        marks = float(input("Enter marks (0-100): "))

        marks = max(0, min(100, marks))

        topics[topic] = marks

    print("\n===== Student Performance Report =====")

    print("Student Name:", student_name)

    # Analyze performance and recommend learning

    for topic, marks in topics.items():

        print(f"\nTopic: {topic}")

        print("Marks:", marks, "%")

        if marks < 40:

            print("Difficulty: Easy")

            print("Recommendation: Learn the basics and practice simple exercises.")

        elif marks < 70:

            print("Difficulty: Medium")

            print("Recommendation: Revise concepts and solve more practice questions.")

        else:

            print("Difficulty: Advanced")

            print("Recommendation: Try advanced exercises and projects.")

    # Identify the weakest topic

    weakest_topic = min(topics, key=topics.get)

    print("\n===== Personalized Recommendation =====")

    print("Topic to improve:", weakest_topic)

    print("Recommended Action: Study this topic and take another practice test.")

    print("\nThank you for using Personalized Learning System!")

personalized_learning()

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://python-study-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cff72d87-3078-5315-9622-e56cec0505a3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
