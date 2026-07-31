export function buildExplainPrompt(architecture: {
  pattern: string;
  description: string;
  components: Array<{ id: string; type: string; label: string; description: string }>;
  connections: Array<{ id: string; sourceId: string; targetId: string; label: string; type: string }>;
}): string {
  const compsText = architecture.components
    .map((c) => `  - ${c.label} (${c.type}): ${c.description}`)
    .join("\n");

  const connsText = architecture.connections
    .map((c) => `  - ${c.sourceId} → ${c.targetId}: ${c.label} (${c.type})`)
    .join("\n");

  return `You are an expert software architect. Given a High-Level Design (HLD), produce a structured architecture explanation.

## Architecture Data

Pattern: ${architecture.pattern}

Description: ${architecture.description}

Components:
${compsText}

Connections:
${connsText}

## Output Format
Respond with ONLY valid JSON matching this exact schema:

{
  "summary": "2-3 paragraph executive summary of the overall architecture, what it does, and its key characteristics",
  "patternExplanation": "Explain why the ${architecture.pattern} pattern was chosen, its benefits and tradeoffs for this specific system",
  "componentExplanations": [
    {
      "id": "component-id",
      "label": "Component label",
      "explanation": "Detailed explanation of what this component does, its responsibilities, and why it fits in this architecture"
    }
  ],
  "designDecisions": [
    {
      "topic": "e.g. Technology Choice, Scalability, Security, Data Flow",
      "decision": "The specific decision made",
      "rationale": "Why this decision was made and what tradeoffs were accepted"
    }
  ]
}

## Rules
- summary must cover: system purpose, architecture pattern, how components interact, key design characteristics.
- patternExplanation must connect the pattern's generic traits to this specific system's needs.
- Include one componentExplanations entry per component. Be specific about what each component does in THIS system.
- designDecisions must include at least 3 entries covering: pattern choice rationale, data flow approach, and a technology or security consideration.
- The explanation is for a technical audience (developers, architects) — use appropriate terminology but avoid unnecessary jargon.`;
}
