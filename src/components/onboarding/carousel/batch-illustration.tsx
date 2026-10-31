import  { useEffect, useRef, useState } from "react";
import Matter, { Events } from "matter-js";

const count = 100;

// Extend the Matter.Body type to include our custom property
interface CustomBody extends Matter.Body {
  isShrinking?: boolean;
}

export const BatchIllustration = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [_, setCircles] = useState<Matter.Body[]>([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, Bodies, World, Body } = Matter;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0005 }, // Adjust gravity
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
      },
    });

    // Create runner
    const runner = Runner.create();

    // Add rounded rectangles
    const rectangles: Matter.Body[] = [];

    for (let i = 0; i < count; i++) {
      // const aspect = 3 / 4;
      const rectWidth = Math.random() * 30 + 20;

      const x = Math.random() * width;
      const y = 0.1; //

      const circle = Bodies.circle(x, y, rectWidth / 2, {
        restitution: 0.4,
        friction: 0.1,
        render: {
          fillStyle: `hsl(81, 83%, ${Math.random() * 50 + 25}%)`,
        },
      });
      rectangles.push(circle);
    }

    World.add(engine.world, rectangles);

    // Add walls to keep rectangles inside
    const wallThickness = 1;
    const walls = [
      Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, render: { visible: false } }
      ),
      Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
        isStatic: true,
      }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { visible: false } }
      ),
    ];
    World.add(engine.world, walls);

    // Function to check if a body has settled
    const hasSettled = (body: CustomBody) => {
      return Math.abs(body.velocity.y) < 0.1 && Math.abs(body.velocity.x) < 0.1;
    };

    // Function to shrink a body
    const shrinkBody = (body: CustomBody) => {
      const shrinkFactor = 0.1; // Shrink to 10%
      const originalArea = body.bounds.max.x - body.bounds.min.x;
      const shrinkDuration = originalArea * 500 * 50; // Duration based on size

      let elapsedTime = 0;
      const shrinkInterval = setInterval(() => {
        elapsedTime += 16; // Assuming 60 FPS
        const progress = Math.min(elapsedTime / shrinkDuration, 1);
        const scale = 1 - (1 - shrinkFactor) * progress * Math.random();

        const width = body?.bounds?.max.x - body?.bounds?.min.x;

        if (width && width > 20 && width < 100) {
          Body.scale(body, scale, scale);
        }

        if (progress >= 1) {
          clearInterval(shrinkInterval);
        }
      }, 16);
    };

    // Check for settled bodies and initiate shrinking
    Events.on(engine, "afterUpdate", () => {
      rectangles.forEach((rectangle: CustomBody) => {
        if (hasSettled(rectangle) && !rectangle.isShrinking) {
          rectangle.isShrinking = true;
          shrinkBody(rectangle);
        }
      });
    });

    // Function to create a new circle
    const createCircle = (x: number, y: number) => {
      const rectWidth = Math.random() * 30 + 20;
      return Bodies.circle(x, y, rectWidth / 2, {
        restitution: 0.4,
        friction: 0.1,
        render: {
          fillStyle: `hsl(81, 83%, ${Math.random() * 50 + 25}%)`,
        },
      });
    };

    // Add initial circles
    const initialCircles = Array.from({ length: count }, () =>
      createCircle(Math.random() * width, 0.1)
    );
    setCircles(initialCircles);
    World.add(engine.world, initialCircles);

    // Click event handler
    const handleClick = (event: MouseEvent) => {
      const rect = sceneRef.current!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newCircle = createCircle(x, y);
      setCircles((prevCircles) => [...prevCircles, newCircle]);
      World.add(engine.world, newCircle);
    };

    // Add click event listener
    sceneRef.current.addEventListener("click", handleClick);

    // Start the engine and renderer
    Render.run(render);
    Runner.run(runner, engine);

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      sceneRef.current?.removeEventListener("click", handleClick);
    };
  }, [count]);

  return <div ref={sceneRef} style={{ width: "100%", height: "100%" }} />;
};
