#!/usr/bin/env bash
set -e

ITERATION=1
MAX_ITERATIONS=8

mkdir -p .gemini

while [ $ITERATION -le $MAX_ITERATIONS ]; do
  echo "=========================================================="
  echo ">>> REFINEMENT LOOP: ITERATION $ITERATION OF $MAX_ITERATIONS"
  echo "=========================================================="
  rm -f .gemini/critique.md

  # 1. Visual Director Audit
  echo ">>> [1/3] Visual Director Auditing Design..."
  agy --dangerously-skip-permissions -p "Read .agents/visual_director.md. Inspect the website UI, typography, and 3D bottle implementation. Append visual_score: <0-100> and any BLOCKER items to .gemini/critique.md."

  # 2. Runtime & Stability Audit
  echo ">>> [2/3] Tester Running Verification & Browser Checks..."
  agy --dangerously-skip-permissions -p "Read .agents/tester.md. Ensure dev server is live on localhost:3000. Inspect browser console, scroll frame rates, 404s, and interactive elements. Append stability_score: <0-100> and any BLOCKER items to .gemini/critique.md."

  # 3. Deterministic Decision Gate
  echo ">>> [3/3] Evaluating Quality Scores & Blockers..."
  DECISION=$(node -e "
    const fs = require('fs');
    if (!fs.existsSync('.gemini/critique.md')) {
      console.log(JSON.stringify({ passed: false, reason: 'Critique file missing' }));
      process.exit(0);
    }
    const content = fs.readFileSync('.gemini/critique.md', 'utf8');
    const vMatch = content.match(/visual_score:\s*(\d+)/i);
    const sMatch = content.match(/stability_score:\s*(\d+)/i);
    const vScore = vMatch ? parseInt(vMatch[1], 10) : 0;
    const sScore = sMatch ? parseInt(sMatch[1], 10) : 0;
    const hasBlockers = content.includes('BLOCKER:');

    const passed = (vScore >= 95 && sScore === 100 && !hasBlockers);
    console.log(JSON.stringify({ passed, vScore, sScore, hasBlockers }));
  " 2>/dev/null || echo '{"passed":false,"vScore":0,"sScore":0,"hasBlockers":true}')

  PASSED=$(echo "$DECISION" | node -e "const d = JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log(d.passed);")
  VSCORE=$(echo "$DECISION" | node -e "const d = JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log(d.vScore);")
  SSCORE=$(echo "$DECISION" | node -e "const d = JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log(d.sScore);")

  echo ">>> Current Scores -> Visual: $VSCORE/100 | Stability: $SSCORE/100"

  if [ "$PASSED" = "true" ]; then
    echo "=========================================================="
    echo ">>> VERIFICATION PASSED: Site achieved Awwwards Tier!"
    echo ">>> Final Scores: Visual $VSCORE/100 | Stability $SSCORE/100 with 0 Blockers."
    echo "=========================================================="
    exit 0
  fi

  # 4. Surgical Remediation
  echo ">>> Blockers detected. Dispatching Refiner to patch..."
  agy --dangerously-skip-permissions -p "Read .agents/refiner.md and .gemini/critique.md. Fix all identified BLOCKER issues across styles, Three.js shaders, and interactive mechanics. Apply surgical code fixes only."

  ITERATION=$((ITERATION + 1))
done

echo ">>> Loop hit max limit ($MAX_ITERATIONS iterations). Check .gemini/critique.md for remaining items."
