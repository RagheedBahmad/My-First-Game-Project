# My-First-Game-Project
This is my first game project, following this video (https://www.youtube.com/watch?v=yP5DKzriqXA). It's a game very similar to Pokemon as a starting point.

Note #1:
  Chris used a simple boolean system with a lastKey flag to control his movements, I was not satisfied with how my character was moving with that system.
  So I implemented a Linked list to function like a better version of a Stack as to log the keys pressed in order and removing the keys that were depressed 
  whereever they were, which isn't possible in a stack since you can only pop the top element. So you go in the direction of the last key pressed, and every
  depressed key is removed from the log so you can no longer go in that direction unless pressed again, resulting in a smoother movement. (The LinkedList class
  is admittedly a mess, I might optimize it later).
