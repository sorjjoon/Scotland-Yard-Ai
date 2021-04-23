### Weekly report 5. (17.4-24.4)

The first priority this week was creating a more powerful version of MCTS, explorative search which is now completed. This version uses info gathered from previous runs to make it's decisions, on which moves it decides to focus it's efforts on. The ai plays well, but at first glance it is difficult to estimate, if it's significantly better than the pure version.

To facilitate better testing setup was created to allow gameplay to loop upon itself, allowing automated gameplay against itself. However, since games take so long (I have not yet tested the effect of move processing time on move quality, so I've decided to keep the processing time at 5s).

Since testing takes so long, I don't have exhaustive tests for this week, but will have some for next week, hopefully allowing insights on how to potentially improve the algorithm (one way could be the so called "exploration constant").

The biggest challenges this week was researching explorative MCTS, and tweaking the algorithm, to make it return sensible results. Attempts to try and improve algorithm performance were made, with no notable results (details in testing)
