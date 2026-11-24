#!/usr/bin/env node
// Computes a RICE score: (Reach × Impact × Confidence) ÷ Effort.
// Intercom default scales: Impact 3|2|1|0.5|0.25; Confidence 1|0.8|0.5; Effort person-months ≥ 0.5.
// Usage: node scripts/rice.mjs --reach=800 --impact=2 --confidence=0.8 --effort=2
// Status on stderr; JSON on stdout.

function fail(message) {
  process.stderr.write(`rice: ${message}\n`)
  process.exit(1)
}

function arg(name) {
  const prefix = `--${name}=`
  const raw = process.argv.slice(2).find((a) => a.startsWith(prefix))
  if (!raw) fail(`missing ${prefix}<number>`)
  const value = Number(raw.slice(prefix.length))
  if (!Number.isFinite(value)) fail(`${name} must be a finite number`)
  return value
}

const reach = arg('reach')
const impact = arg('impact')
const confidence = arg('confidence')
const effort = arg('effort')

// Minimum half person-month matches Intercom’s guidance to avoid zero-division and micro-estimates.
if (reach < 0) fail('reach must be ≥ 0')
if (![3, 2, 1, 0.5, 0.25].includes(impact)) {
  process.stderr.write('rice: warning: impact outside Intercom scale 3|2|1|0.5|0.25\n')
}
if (confidence <= 0 || confidence > 1) fail('confidence must be in (0, 1]')
if (effort < 0.5) fail('effort must be ≥ 0.5 person-months')

const score = (reach * impact * confidence) / effort
const result = {
  reach,
  impact,
  confidence,
  effort,
  rice: Number(score.toFixed(4)),
}

process.stderr.write(`RICE = (${reach} × ${impact} × ${confidence}) ÷ ${effort} = ${result.rice}\n`)
process.stdout.write(`${JSON.stringify(result)}\n`)
