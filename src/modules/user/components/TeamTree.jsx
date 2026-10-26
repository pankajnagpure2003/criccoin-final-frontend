import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

const NODE_WIDTH = 180;
const SLOT_WIDTH = 205;
const ROW_HEIGHT = 132;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

function formatUsdt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function memberName(member) {
  return member.username || member.referralCode || member.name || "Criccoin member";
}

function getMaximumLevel(member, depth = 0) {
  return (member?.children || []).reduce(
    (maximum, child) => Math.max(maximum, getMaximumLevel(child, depth + 1)),
    depth
  );
}

function prepareLayout(root, visibleLevels) {
  const rows = [];
  const links = [];
  let leafIndex = 0;
  if (!root) {
    return { rows, links, width: SLOT_WIDTH, height: 110 };
  }

  function place(member, depth, parent = null) {
    const row = rows[depth] || (rows[depth] = []);
    const node = { member, depth, parent, x: 0 };
    row.push(node);

    const children = depth < visibleLevels ? member.children || [] : [];
    if (children.length === 0) {
      node.x = leafIndex * SLOT_WIDTH + SLOT_WIDTH / 2;
      leafIndex += 1;
    } else {
      const childNodes = children.map((child) => place(child, depth + 1, node));
      node.x = (childNodes[0].x + childNodes[childNodes.length - 1].x) / 2;
      for (const child of childNodes) {
        links.push({ from: node, to: child });
      }
    }

    return node;
  }

  place(root, 0);
  return {
    rows,
    links,
    width: Math.max(SLOT_WIDTH, leafIndex * SLOT_WIDTH),
    height: (rows.length - 1) * ROW_HEIGHT + 110,
  };
}

function collectAncestors(member, query, ancestors = new Set()) {
  const matches = memberName(member).toLowerCase().includes(query)
    || String(member.email || "").toLowerCase().includes(query);
  let descendantMatches = false;
  for (const child of member.children || []) {
    descendantMatches = collectAncestors(child, query, ancestors) || descendantMatches;
  }
  if (matches || descendantMatches) {
    ancestors.add(member.id);
  }
  return matches || descendantMatches;
}

function TreeNode({ node, highlight, dimmed }) {
  const { member, depth, parent } = node;
  const sponsor = parent ? memberName(parent.member) : "Unknown";

  return (
    <article
      className={`team-visual-node${highlight ? " is-highlighted" : ""}${dimmed ? " is-dimmed" : ""}`}
      aria-label={`${memberName(member)}, level ${depth}, self investment ${formatUsdt(member.selfInvestmentUsdt)} USDT, team business ${formatUsdt(member.teamBusinessUsdt)} USDT`}
    >
      <span className="team-visual-avatar" aria-hidden="true" />
      <span className="team-visual-node-details">
        <strong title={memberName(member)}>{memberName(member)}</strong>
        <span>Sponsor: {sponsor}</span>
        <small>Self: {formatUsdt(member.selfInvestmentUsdt)} USDT</small>
        <small>Team: {formatUsdt(member.teamBusinessUsdt)} USDT</small>
      </span>
    </article>
  );
}

export default function TeamTree({ tree }) {
  const maxLevel = getMaximumLevel(tree);
  const [levelLimit, setLevelLimit] = useState(Math.max(1, Math.min(10, maxLevel || 1)));
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const wheelZoomRef = useRef(null);
  const layout = useMemo(() => prepareLayout(tree, levelLimit), [tree, levelLimit]);
  const scaledWidth = Math.ceil(layout.width * zoom);
  const scaledHeight = Math.ceil(layout.height * zoom);
  const highlightedIds = useMemo(() => {
    const ids = new Set();
    if (search.trim()) {
      collectAncestors(tree, search.trim().toLowerCase(), ids);
    }
    return ids;
  }, [tree, search]);
  const hasSearch = Boolean(search.trim());

  useLayoutEffect(() => {
    const anchor = wheelZoomRef.current;
    const viewport = viewportRef.current;
    if (!anchor || !viewport) {
      return;
    }

    const scale = zoom / anchor.zoom;
    viewport.scrollLeft = (anchor.scrollLeft + anchor.x) * scale - anchor.x;
    viewport.scrollTop = (anchor.scrollTop + anchor.y) * scale - anchor.y;
    wheelZoomRef.current = null;
  }, [zoom]);

  function zoomWithWheel(event) {
    event.preventDefault();
    if (event.deltaY === 0) {
      return;
    }

    const direction = event.deltaY < 0 ? 1 : -1;
    const nextZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, Number((zoom + direction * ZOOM_STEP).toFixed(1)))
    );
    if (nextZoom === zoom) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    wheelZoomRef.current = {
      zoom,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      scrollLeft: event.currentTarget.scrollLeft,
      scrollTop: event.currentTarget.scrollTop,
    };
    setZoom(nextZoom);
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    viewport.addEventListener("wheel", zoomWithWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", zoomWithWheel);
  }, [zoom]);

  function startPan(event) {
    if (event.button !== 0 || event.target.closest("button, input, label")) {
      return;
    }
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function pan(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !viewportRef.current) {
      return;
    }
    viewportRef.current.scrollLeft = drag.scrollLeft - (event.clientX - drag.x);
    viewportRef.current.scrollTop = drag.scrollTop - (event.clientY - drag.y);
  }

  function stopPan(event) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  }

  function changeZoom(amount) {
    setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((current + amount).toFixed(1)))));
  }

  if (!tree) {
    return null;
  }

  return (
    <section className="team-tree-panel team-visual-panel" aria-label="Referral team tree">
      <div className="team-visual-controls">
        <label>
          <span>Fetch Levels</span>
          <input
            type="number"
            min="1"
            max={Math.max(1, maxLevel)}
            value={levelLimit}
            onChange={(event) => {
              const value = Number(event.target.value);
              setLevelLimit(Math.min(Math.max(value || 1, 1), Math.max(1, maxLevel)));
            }}
          />
        </label>
        <label className="team-visual-search">
          <span>Search User</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or Username"
          />
        </label>
        <div className="team-zoom-controls" role="group" aria-label="Tree zoom controls">
          <button
            type="button"
            aria-label="Zoom out"
            title="Zoom out"
            disabled={zoom <= MIN_ZOOM}
            onClick={() => changeZoom(-ZOOM_STEP)}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            title="Zoom in"
            disabled={zoom >= MAX_ZOOM}
            onClick={() => changeZoom(ZOOM_STEP)}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Reset zoom"
            title="Reset zoom"
            disabled={zoom === 1}
            onClick={() => setZoom(1)}
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`team-visual-scroll${isDragging ? " is-dragging" : ""}`}
        role="region"
        aria-label="Referral tree. Use the mouse wheel to zoom and drag to pan."
        tabIndex="0"
        onPointerDown={startPan}
        onPointerMove={pan}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
        onLostPointerCapture={() => {
          dragRef.current = null;
          setIsDragging(false);
        }}
      >
        <div
          className="team-visual-stage"
          style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
        >
          <div
            className="team-visual-canvas"
            style={{
              width: `${layout.width}px`,
              height: `${layout.height}px`,
              transform: `scale(${zoom})`,
            }}
          >
            <svg
              className="team-visual-connectors"
              width={layout.width}
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
            >
              {layout.links.map(({ from, to }) => {
                const startY = 40 + from.depth * ROW_HEIGHT + 52;
                const endY = 40 + to.depth * ROW_HEIGHT - 3;
                const controlY = startY + (endY - startY) * 0.52;
                return (
                  <path
                    key={`${from.member.id}-${to.member.id}`}
                    d={`M ${from.x} ${startY} C ${from.x} ${controlY}, ${to.x} ${controlY}, ${to.x} ${endY}`}
                  />
                );
              })}
            </svg>
            {layout.rows.map((row, depth) =>
              row.map((node) => {
                const highlighted = highlightedIds.has(node.member.id);
                return (
                  <div
                    className="team-visual-node-position"
                    key={node.member.id}
                    style={{
                      left: `${node.x}px`,
                      top: `${40 + depth * ROW_HEIGHT}px`,
                      width: `${NODE_WIDTH}px`,
                    }}
                  >
                    <TreeNode
                      node={node}
                      highlight={highlighted}
                      dimmed={hasSearch && !highlighted}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {tree.children.length === 0 ? (
        <p className="team-tree-empty">No one has joined your team yet. Share your referral link to get started.</p>
      ) : null}
    </section>
  );
}
