System\_Arch



Objective



Redesign the architecture generation engine so that every generated system architecture follows a clean, professional, and logically correct layout similar to the reference architecture.



The focus is NOT on changing the UI theme or node design.

The focus is entirely on:



Layout

Node positioning

Connector routing

Arrow logic

Spacing

Alignment

Readability





**Part 1 — Layout Engine**



The generated architecture must follow a structured graph layout instead of randomly placing nodes.



Use a hierarchical layered layout similar to enterprise architecture diagrams.



Example hierarchy:



Layer 1



User

External Systems



↓



Layer 2



Frontend

Mobile App

API Gateway



↓



Layer 3



Core Services



↓



Layer 4



Database

Cache

Queue

Storage



↓



Layer 5



Monitoring

Logging

Analytics



Every layer must remain horizontal.



Nodes inside the same layer must also be horizontally aligned.



Never randomly offset nodes.









**Part 2 — Grid Alignment**



Every node must snap to an invisible grid.



Rules:



Equal horizontal spacing

Equal vertical spacing

Same row = perfectly aligned

Same column = perfectly aligned



No node should appear slightly higher or lower than neighboring nodes.



The architecture should look mathematically balanced.









**Part 3 — Node Spacing**



Maintain generous spacing.



Minimum requirements:



Horizontal Gap:

150–250 px



Vertical Gap:

120–200 px



Increase spacing automatically for larger architectures.



Never compress nodes together.



Never allow labels to overlap.



Never allow connectors to touch node labels.







**Part 4 — Connector Anchor Rules**



This is mandatory.



Every connector must attach only to valid anchor points.



Allowed anchors:



• Top

• Bottom

• Left

• Right



Do NOT connect to random positions on node borders.



Example:



Incoming connection from above

→ connect to TOP anchor



Incoming connection from left

→ connect to LEFT anchor



Outgoing downward connection

→ connect from BOTTOM anchor



Outgoing right connection

→ connect from RIGHT anchor



Anchor selection must be based on relative node position.







**Part 5 — Multiple Connection Rules**



If multiple arrows enter the same node:



Incorrect:



One arrow enters TOP



Two arrows enter RIGHT



One enters LEFT



Correct:



If all source nodes are above,



ALL arrows should connect to the TOP anchor.



Similarly,



If all source nodes are on the left,



ALL arrows should use the LEFT anchor.



Never distribute arrows across random sides.



Anchor selection must remain logically consistent.







**Part 6 — Edge Routing**



Edges must never be drawn as random straight lines.



Use orthogonal routing:



Horizontal



↓



Vertical



↓



Horizontal



or



Vertical



↓



Horizontal



↓



Vertical



Only 90° bends.



Avoid diagonal lines.



Avoid crossing through nodes.



Avoid unnecessary bends.





**Part 7 — Edge Crossing Prevention**



This is one of the highest priorities.



The routing engine must minimize edge crossings.



Rules:



• Never draw a connector through another node.



• Avoid connector intersections whenever possible.



• Route around occupied areas.



• Recalculate paths if intersections occur.



• Prefer longer clean routes over short messy routes.







**Part 8 — Connector Collision Avoidance**



Connectors should never overlap each other.



When multiple connectors share similar paths:



Add routing offsets.

Separate parallel lines.

Maintain a consistent gap.

Keep paths visually distinct.







**Part 9 — Parent–Child Positioning**



Children should always be positioned beneath or beside their parent.



Example:



API Gateway



↓



Authentication



↓



Database



NOT



Database



↓



API Gateway



unless explicitly requested.



The layout should reflect dependency direction.







**Part 10 — Symmetry Rules**



If two nodes serve the same role:



Authentication



User Service



Chat Service



They should appear on the same row.



Not randomly staggered.



If three databases exist:



Database



Redis



Vector DB



They should also share the same row.



Symmetry greatly improves readability.







**Part 11 — Automatic Layout Optimization**



Before rendering:



Run an optimization pass.



The optimizer should:



Detect overlaps

Detect edge crossings

Detect excessive connector bends

Detect uneven spacing

Detect isolated nodes

Detect misaligned rows

Detect misaligned columns



Then reposition nodes automatically.







Part 12 — Rendering Quality Rules



The final diagram must satisfy all of the following:



✓ No overlapping nodes



✓ No overlapping labels



✓ No overlapping connectors



✓ Equal spacing



✓ Straight alignment



✓ Clean hierarchy



✓ Logical grouping



✓ Proper connector anchors



✓ Orthogonal routing



✓ Minimal edge crossings



✓ Professional architecture appearance















