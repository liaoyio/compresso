import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

export const Arrows: React.FC<{ count: number }> = ({ count }) => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, Composite, Body, Events, Vector } =
      Matter;

    const width = sceneRef.current!.clientWidth;
    const height = sceneRef.current!.clientHeight;

    // Create engine
    const engine = Engine.create();
    engine.gravity.y = 0.0001; // Disable gravity
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add bodies (small circles)
    const circles: Matter.Body[] = [];
    const rows = count;
    const cols = count;
    const padding = 0;
    const size =
      Math.min((width - padding * 2) / cols, (height - padding * 2) / rows) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x =
          padding +
          size +
          (col * (width - padding * 2)) / cols +
          Math.random() * 10 -
          5;
        const y =
          padding +
          size +
          (row * (height - padding * 2)) / rows +
          Math.random() * 10 -
          5;

        // get random between 0 and 50
        const l = Math.random() * 50;

        const circle = Bodies.circle(x, y, size, {
          restitution: 1.1,
          friction: 100,
          render: {
            fillStyle: `hsl(81, 83%, ${l}%)`,
          },
        });
        circles.push(circle);
      }
    }

    Composite.add(engine.world, circles);
    // Center of attraction
    const center = {
      x: width / 2,
      y: height / 2,
    };

    // Events.on(engine, "collisionStart", (event) => {
    //   event.pairs.forEach((pair) => {
    //     const bodyA = pair.bodyA;
    //     const bodyB = pair.bodyB;

    //     // Ensure we're dealing with circles
    //     if (bodyA.circleRadius && bodyB.circleRadius) {
    //       // Shrink both bodies
    //       const shrinkFactor = 0.995; // Adjust this value to control shrinking amount
    //       Body.scale(bodyA, shrinkFactor, shrinkFactor);
    //       Body.scale(bodyB, shrinkFactor, shrinkFactor);
    //     }
    //   });
    // });

    // Add a gravitational attraction to the center
    Events.on(engine, "beforeUpdate", () => {
      circles.forEach((circle) => {
        const forceDirection = Vector.sub(center, circle.position); // Direction towards the center
        const distance = Vector.magnitude(forceDirection); // Distance to the center

        // scale the circle down until it's size is 1
        let currentSize = circle.circleRadius;

        // only scale down if one second has passed
        if (currentSize! > 10) {
          const scale = 0.99 - Math.random() * 0.00000000001;
          Body.scale(circle, scale, scale);
        }

        if (distance > 5) {
          // Apply force only if the circle is not too close to the center
          const normalizedDirection = Vector.normalise(forceDirection); // Normalize direction
          const forceMagnitude = 0.0002; // Attraction strength
          const force = Vector.mult(
            normalizedDirection,
            forceMagnitude * circle.mass
          ); // Calculate force
          Body.applyForce(circle, circle.position, force);
        }
      });
    });

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} style={{ width: "100%", height: "100%" }} />;
};
