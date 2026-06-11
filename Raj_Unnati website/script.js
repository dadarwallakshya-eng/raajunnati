// ==========================================================================
// RAJ-UNNATI PORTAL DRIVER
// ==========================================================================

// Global state variables
let currentFontSizeOffset = 0;
let isDistrictTableAscending = false;

// 1. Accessibility Functions
function adjustFontSize(offset) {
    const htmlEl = document.documentElement;
    const currentBase = 16;
    if (offset === 0) {
        currentFontSizeOffset = 0;
    } else {
        currentFontSizeOffset += offset;
        // Limit scale between -2px and +4px
        currentFontSizeOffset = Math.max(-2, Math.min(4, currentFontSizeOffset));
    }
    
    htmlEl.style.setProperty('--base-font-size', `${currentBase + currentFontSizeOffset}px`);
    
    // Update active class on buttons
    const btns = document.querySelectorAll('.font-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    if (offset === -1) btns[0].classList.add('active');
    else if (offset === 0) btns[1].classList.add('active');
    else if (offset === 1) btns[2].classList.add('active');
}

// Update current date to match the project context
function updateDateBadge() {
    const dateBadge = document.getElementById('current-date-badge');
    if (dateBadge) {
        // Set a fixed project date or actual date relative to timeline
        dateBadge.textContent = "June 11, 2026";
    }
}

// 2. Mobile Menu Navigation
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuToggleBtn && mobileNav) {
    menuToggleBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = menuToggleBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
            mobileNav.style.display = 'block';
        } else {
            icon.setAttribute('data-lucide', 'menu');
            mobileNav.style.display = 'none';
        }
        lucide.createIcons();
    });
}

function toggleMobileMenu() {
    if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileNav.style.display = 'none';
        const icon = menuToggleBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
}

// 3. Stats Count-Up Animations (CAG, RTI, NeSDA)
const countOptions = {
    root: null,
    threshold: 0.1,
    once: true
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter-value');
            counters.forEach(counter => {
                const target = parseInt(counter.parentNode.getAttribute('data-target'));
                animateCounter(counter, target);
            });
            observer.unobserve(entry.target);
        }
    });
}, countOptions);

const statsPanel = document.querySelector('.audit-statistics-panel');
if (statsPanel) {
    observer.observe(statsPanel);
}

function animateCounter(el, target) {
    let current = 0;
    const duration = 1200; // ms
    const stepTime = Math.abs(Math.floor(duration / target));
    
    const timer = setInterval(() => {
        current += 1;
        el.textContent = current;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        }
    }, stepTime);
}

// 4. Governance Architecture Interactive Nodes
const nodeData = {
    cm: {
        title: "Chief Minister",
        tag: "STRATEGIC CHAIR",
        text: "Chairs the high-level Raj-UNNATI reviews. Evaluates stuck major infrastructure projects, makes immediate inter-ministerial rulings, and enforces deadlines for department heads and district administrators.",
        bullets: [
            "Provides state leadership and strategic direction",
            "Presides over monthly review conferences",
            "Resolves conflicts between departments on the spot",
            "Enforces accountability for delayed actions"
        ]
    },
    cs: {
        title: "Chief Secretary",
        tag: "OVERSIGHT EXECUTIVE",
        text: "Directs implementation monitoring, tracks department timelines, coordinates weekly progress with administrative secretaries, and screens projects for CMIS upload prior to monthly reviews.",
        bullets: [
            "Coordinates inter-departmental clearances",
            "Issues circulars and compliance directives",
            "Resolves micro-bottlenecks before high-level escalation",
            "Tracks action-taken reports from collectors"
        ]
    },
    cmis: {
        title: "CMIS Platform",
        tag: "DIGITAL CORE DATABASE",
        text: "Central dashboard infrastructure storing project data, GIS layouts, inter-departmental files, and complaints. Provides real-time tracking from district verification to state secretariat levels.",
        bullets: [
            "Real-time tracking of files across departments",
            "Central repository for GIS maps and progress logs",
            "Escalation algorithms to detect projects behind schedule",
            "Generates performance charts for executive review"
        ]
    },
    departments: {
        title: "Department Secretariats",
        tag: "SECTOR EXECUTION NODES",
        text: "Secretaries of Energy, Water, Roads, and Mining who upload progress charts, coordinate engineering reports, resolve licensing issues, and justify project delay explanations.",
        bullets: [
            "Responsible for executing policy guidelines on the ground",
            "Monitors contractor speeds and materials delivery",
            "Clears internal department bottlenecks",
            "Prepares monthly reports for the CMIS portal"
        ]
    },
    districts: {
        title: "District Administration",
        tag: "FIELD VERIFICATION NODES",
        text: "Led by District Collectors who handle land acquisition, forest clearances, utility shifts, and resolve citizen grievances at the ground level.",
        bullets: [
            "Implements projects in rural and urban areas",
            "Coordinates local revenue departments for land clearances",
            "Conducts physical checks on project completions",
            "Coordinates directly with Department Secretaries"
        ]
    },
    outlays: {
        title: "Projects, Schemes & Grievances",
        tag: "MEASURABLE OUTCOMES",
        text: "The ultimate focal points of Raj-UNNATI. The portal aims to transform infrastructure, welfare policies, and citizen complaints into verified, tangible outcomes.",
        bullets: [
            "Focuses on PM SHRI, Surya Ghar, and road networks",
            "Evaluates clean energy, water, and mobility outlays",
            "Ensures resolution of public grievances in districts",
            "Shifts success metrics from funds spent to public utility"
        ]
    }
};

function showNodeDetails(nodeId) {
    // Highlight active node visually
    const nodes = document.querySelectorAll('.arch-node, .arch-node-sub');
    nodes.forEach(node => {
        node.classList.remove('active-node');
    });
    
    const activeNode = document.getElementById(`node-${nodeId}`);
    if (activeNode) {
        activeNode.classList.add('active-node');
    }
    
    // Update detail panel text
    const data = nodeData[nodeId];
    if (data) {
        document.getElementById('arch-detail-title').textContent = data.title;
        document.getElementById('arch-detail-text').textContent = data.text;
        
        const cardTag = document.querySelector('#arch-details-card .card-tag');
        if (cardTag) cardTag.textContent = data.tag;
        
        const listEl = document.getElementById('arch-detail-list');
        listEl.innerHTML = '';
        data.bullets.forEach(bullet => {
            const li = document.createElement('li');
            li.innerHTML = `<i data-lucide="check" class="icon-sm text-maroon"></i> ${bullet}`;
            listEl.appendChild(li);
        });
        
        lucide.createIcons();
    }
}

// 5. Workflow Step Highlights
function activateWorkflowStep(stepNum) {
    const steps = document.querySelectorAll('.workflow-step');
    steps.forEach((step, idx) => {
        step.classList.remove('active');
        step.classList.remove('completed');
        if (idx + 1 < stepNum) {
            step.classList.add('completed');
        } else if (idx + 1 === stepNum) {
            step.classList.add('active');
        }
    });
    
    // Update progress bar width
    const progressLine = document.getElementById('workflow-progress');
    if (progressLine) {
        const percentage = ((stepNum - 1) / (steps.length - 1)) * 100;
        progressLine.style.width = `${percentage}%`;
    }
}

// 6. Tabbed Meeting Reviews Data & Switcher
const meetingsData = {
    1: {
        date: "17 January 2026",
        title: "First Raj-UNNATI Governance Review",
        desc: "Chaired by the State Executive to address key bottlenecks in central education and environment programs.",
        outlay: "₹1,943 Crore",
        statusText: "On Track",
        statusColor: "green",
        projects: [
            {
                name: "PM SHRI (Pradhan Mantri Schools for Rising India)",
                detail: "Resolution of matching fund release delays and structural updates across 402 model schools."
            },
            {
                name: "PM Surya Ghar (Muft Bijli Yojana)",
                detail: "Standardizing net metering approvals by DISCOMs and setting district solar quotas."
            }
        ],
        quote: "All administrative roadblocks in DISCOM net metering must be resolved within 7 working days to support the solar rollout."
    },
    2: {
        date: "20 February 2026",
        title: "Second Raj-UNNATI Governance Review",
        desc: "Special review session focused on high-outlay heavy industry, resources, and textile logistics.",
        outlay: "₹84,282 Crore",
        statusText: "Active Action Plan",
        statusColor: "blue",
        projects: [
            {
                name: "Industrial & Mining Infrastructure",
                detail: "Cleared forest clearances for 12 mineral blocks and fast-tracked transmission lines for solar zones."
            },
            {
                name: "Energy Grid Upgrades & Textiles Parks",
                detail: "Approved green corridor connectivity for rural textile parks and grid synchronizations."
            }
        ],
        quote: "Industrial corridors are the state's backbone. Collector coordination on land allocation must be direct and transparent."
    },
    3: {
        date: "28 March 2026",
        title: "Third Raj-UNNATI Governance Review",
        desc: "Core meeting addressing water distribution systems, rural revenue records, and irrigation delays.",
        outlay: "₹4,258 Crore",
        statusText: "Under Tracking",
        statusColor: "blue",
        projects: [
            {
                name: "Agriculture & Canal Networks",
                detail: "Escalated and resolved land dispute blockages along the Indira Gandhi Canal extension channels."
            },
            {
                name: "Water Supply & Rural Revenue Digitization",
                detail: "Linked Jal Jeevan pipe tracking datasets to check project status and verified revenue border claims."
            }
        ],
        quote: "Jal Jeevan outcomes require physical inspections. Expenditure audits must match clean water delivery stats."
    },
    4: {
        date: "24 April 2026",
        title: "Fourth Raj-UNNATI Governance Review",
        desc: "High-level review concerning airport connectivity, administrative structure upgrades, and strict pre-meeting rules.",
        outlay: "₹23,890 Crore",
        statusText: "Enforced Directives",
        statusColor: "green",
        projects: [
            {
                name: "Greenfield Airports & Air Cargo Hubs",
                detail: "Completed land handovers for upcoming logistics parks and air corridors in Udaipur and Jodhpur."
            },
            {
                name: "Administrative Reform: 15-Day Pre-Meeting Rule",
                detail: "Passed rule requiring all departments to upload files 15 days before meetings to prevent delays."
            },
            {
                name: "Officer Accountability Measures",
                detail: "Established tracking system to log unresolved files and monitor responsible officers."
            }
        ],
        quote: "No department files will be reviewed without the 15-day pre-meeting data upload. Transparency starts with early compliance."
    },
    5: {
        date: "15 May 2026",
        title: "Fifth Raj-UNNATI Governance Review",
        desc: "Reviewing urban transport programs and regional land dispute settlements.",
        outlay: "₹33,039 Crore",
        statusText: "Execution Phase",
        statusColor: "green",
        projects: [
            {
                name: "500 E-Buses Procurement & Charging Parks",
                detail: "Cleared budget disbursements for 500 electric buses and marked charging station spots in 7 municipal areas."
            },
            {
                name: "RSRTC Expansion & Urban Mobility Grid",
                detail: "Standardized ticketing systems and set up inter-district bus depots."
            },
            {
                name: "Barmer Regional Boundary Dispute Resolution",
                detail: "Resolved a border land dispute between industrial corridors, clearing delayed oil infrastructure projects."
            }
        ],
        quote: "Public mobility is a right. Charging infrastructure must be deployed on municipal lands with green power priority."
    }
};

function switchReviewTab(tabIndex) {
    // Toggle active tab class
    const tabs = document.querySelectorAll('.review-tab-btn');
    tabs.forEach((tab, idx) => {
        if (idx + 1 === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update meeting content card with selected data
    const data = meetingsData[tabIndex];
    if (data) {
        const contentBox = document.getElementById('review-content-box');
        
        let projectsHtml = '';
        data.projects.forEach(proj => {
            projectsHtml += `
                <li>
                    <strong>${proj.name}</strong>
                    <p>${proj.detail}</p>
                </li>
            `;
        });
        
        contentBox.innerHTML = `
            <div class="review-card-layout">
                <div class="rev-main-info">
                    <span class="meeting-date-badge">${data.date}</span>
                    <h3>${data.title}</h3>
                    <p class="rev-intro-text">${data.desc}</p>
                    
                    <h4 class="sub-list-title">Core Initiatives & Focus Projects:</h4>
                    <ul class="projects-reviewed-list">
                        ${projectsHtml}
                    </ul>
                </div>
                
                <div class="rev-sidebar-stats">
                    <div class="rev-outlay-box">
                        <span class="rev-outlay-title">ALLOCATED OUTLAY</span>
                        <span class="rev-outlay-val">${data.outlay}</span>
                    </div>
                    <div class="rev-status-list">
                        <div class="rev-status-item">
                            <span class="status-dot ${data.statusColor}"></span>
                            <span class="status-label">Implementation: <strong>${data.statusText}</strong></span>
                        </div>
                        <div class="rev-status-item">
                            <span class="status-dot blue"></span>
                            <span class="status-label">Secretariat Oversight: <strong>Active</strong></span>
                        </div>
                    </div>
                    <div class="rev-quote-box">
                        <p class="rev-quote">"${data.quote}"</p>
                        <span class="rev-quote-author">— Chief Minister, Decision Directive</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// 7. Live Governance Dashboard: Charts Configuration (Chart.js)
function initializeCharts() {
    // Chart 1: Sector project counts
    const sectorCtx = document.getElementById('sectorProjectsChart');
    if (sectorCtx) {
        new Chart(sectorCtx, {
            type: 'doughnut',
            data: {
                labels: ['Energy', 'Water', 'Roads & Aviation', 'Industries & Mining', 'Urban Mobility'],
                datasets: [{
                    data: [34, 42, 28, 25, 13],
                    backgroundColor: [
                        '#E65A28', // Saffron
                        '#10B981', // Green
                        '#3B82F6', // Blue
                        '#8A1538', // Maroon
                        '#D4AF37'  // Gold
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            boxWidth: 12
                        }
                    }
                }
            }
        });
    }

    // Chart 2: Grievance Resolution Trend
    const trendCtx = document.getElementById('grievanceTrendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'bar',
            data: {
                labels: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'],
                datasets: [
                    {
                        label: 'Grievances Received',
                        data: [2100, 2450, 1980, 2300, 2600, 1482],
                        backgroundColor: '#8A1538',
                        borderRadius: 4
                    },
                    {
                        label: 'Grievances Resolved',
                        data: [1890, 2250, 1910, 2180, 2490, 1380],
                        backgroundColor: '#10B981',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            boxWidth: 12
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        grid: { color: '#f1f5f9' }
                    }
                }
            }
        });
    }
}

// 8. Dashboard District Rankings Table
const districtsLeaderboard = [
    { rank: 1, name: "Jaipur", projects: 48, resolution: "96.4%", score: 95.8, status: "Excellent" },
    { rank: 2, name: "Alwar", projects: 32, resolution: "94.2%", score: 92.5, status: "Excellent" },
    { rank: 3, name: "Kota", projects: 29, resolution: "93.8%", score: 91.4, status: "Excellent" },
    { rank: 4, name: "Udaipur", projects: 26, resolution: "91.1%", score: 89.2, status: "On Track" },
    { rank: 5, name: "Jodhpur", projects: 31, resolution: "90.5%", score: 88.7, status: "On Track" },
    { rank: 6, name: "Ajmer", projects: 22, resolution: "92.0%", score: 87.5, status: "On Track" },
    { rank: 7, name: "Bikaner", projects: 18, resolution: "89.4%", score: 85.1, status: "On Track" },
    { rank: 8, name: "Bhilwara", projects: 15, resolution: "88.1%", score: 83.2, status: "Average" },
    { rank: 9, name: "Sikar", projects: 17, resolution: "86.5%", score: 82.0, status: "Average" },
    { rank: 10, name: "Churu", projects: 12, resolution: "85.0%", score: 79.4, status: "Average" },
    { rank: 11, name: "Sri Ganganagar", projects: 14, resolution: "84.2%", score: 78.1, status: "Average" },
    { rank: 12, name: "Hanumangarh", projects: 11, resolution: "83.0%", score: 76.5, status: "Average" },
    { rank: 13, name: "Barmer", projects: 20, resolution: "81.2%", score: 74.2, status: "Review Zone" },
    { rank: 14, name: "Jaisalmer", projects: 10, resolution: "78.4%", score: 70.8, status: "Review Zone" },
    { rank: 15, name: "Sirohi", projects: 8, resolution: "72.5%", score: 62.8, status: "High Scrutiny" }
];

function populateDistrictTable(data) {
    const tbody = document.getElementById('district-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        let statusClass = 'text-green';
        if (item.status === 'Review Zone') statusClass = 'text-saffron';
        if (item.status === 'High Scrutiny') statusClass = 'text-red';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${item.rank}</strong></td>
            <td><strong>${item.name}</strong></td>
            <td>${item.projects}</td>
            <td>${item.resolution}</td>
            <td><strong>${item.score}</strong></td>
            <td><span class="category-badge ${statusClass}">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function filterDistrictTable() {
    const input = document.getElementById('district-search-input');
    const query = input.value.toLowerCase();
    
    const filtered = districtsLeaderboard.filter(dist => 
        dist.name.toLowerCase().includes(query)
    );
    populateDistrictTable(filtered);
}

function sortDistrictTable() {
    isDistrictTableAscending = !isDistrictTableAscending;
    const sorted = [...districtsLeaderboard].sort((a, b) => {
        return isDistrictTableAscending ? a.score - b.score : b.score - a.score;
    });
    
    // Recalculate rank indicator based on sorted list if needed
    populateDistrictTable(sorted);
}

// Map Region Trigger Interaction
function highlightDistrictRegion(regionName, indexScore, auditStatus) {
    const regionNameEl = document.getElementById('map-region-name');
    const scoreEl = document.getElementById('map-region-score');
    const statusEl = document.getElementById('map-region-status');
    
    if (regionNameEl && scoreEl && statusEl) {
        regionNameEl.textContent = `${regionName} Region`;
        scoreEl.textContent = `${indexScore}%`;
        statusEl.textContent = auditStatus;
        
        // Change text color depending on status
        if (auditStatus.includes('Excellent') || auditStatus.includes('Excellent')) {
            scoreEl.className = "r-stat-val text-green";
            statusEl.className = "r-stat-val text-green";
        } else if (auditStatus.includes('Average') || auditStatus.includes('Amber')) {
            scoreEl.className = "r-stat-val text-saffron";
            statusEl.className = "r-stat-val text-saffron";
        } else {
            scoreEl.className = "r-stat-val text-red";
            statusEl.className = "r-stat-val text-red";
        }
    }
}

// 9. Document Library: Mock DB and Search/Filter
const documentDatabase = [
    { title: "Minutes of the 1st Raj-UNNATI Governance Review Meeting", category: "minutes", date: "18 Jan 2026", dept: "Cabinet Secretariat" },
    { title: "Minutes of the 2nd Raj-UNNATI Governance Review Meeting", category: "minutes", date: "21 Feb 2026", dept: "Cabinet Secretariat" },
    { title: "Minutes of the 3rd Raj-UNNATI Governance Review Meeting", category: "minutes", date: "29 Mar 2026", dept: "Cabinet Secretariat" },
    { title: "Minutes of the 4th Raj-UNNATI Governance Review Meeting", category: "minutes", date: "25 Apr 2026", dept: "Cabinet Secretariat" },
    { title: "Minutes of the 5th Raj-UNNATI Governance Review Meeting", category: "minutes", date: "16 May 2026", dept: "Cabinet Secretariat" },
    { title: "Administrative Rules for CMIS Portal Integration & Uploads", category: "circulars", date: "12 Jan 2026", dept: "Administrative Reforms Dept" },
    { title: "SOP on 15-Day Pre-Meeting Rule for Department Submissions", category: "circulars", date: "26 Apr 2026", dept: "Administrative Reforms Dept" },
    { title: "Guidelines for Officer Accountability & Delay Metrics", category: "circulars", date: "02 May 2026", dept: "Personnel Department" },
    { title: "Public Works Delay Assessment: CAG Mid-term Findings Reference", category: "reports", date: "15 Dec 2025", dept: "Finance Department" },
    { title: "Jal Jeevan Mission District Execution Audit Report", category: "reports", date: "14 Feb 2026", dept: "Public Health Engineering Dept" },
    { title: "Urban Electric Mobility Expansion Feasibility Assessment", category: "reports", date: "10 May 2026", dept: "Urban Development & Housing" }
];

let activeDocumentCategory = 'all';

function populateDocsTable(data) {
    const tbody = document.getElementById('docs-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px;">No files found matching your search.</td></tr>`;
        return;
    }
    
    data.forEach(item => {
        let catText = item.category === 'minutes' ? 'Meeting Minutes' : (item.category === 'circulars' ? 'Circulars & Rules' : 'Reports');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <a href="#document-library" class="doc-link" onclick="downloadMockFile('${item.title}')">
                    <i data-lucide="file-text" class="icon-sm"></i> ${item.title}
                </a>
            </td>
            <td><span class="category-badge ${item.category}">${catText}</span></td>
            <td>${item.date}</td>
            <td>${item.dept}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="downloadMockFile('${item.title}')">
                    <i data-lucide="download" class="icon-xs"></i> PDF
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

function filterCategory(cat) {
    activeDocumentCategory = cat;
    
    // Toggle active chip style
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        const text = chip.textContent.toLowerCase();
        if (cat === 'all' && text.includes('all')) chip.classList.add('active');
        else if (cat === 'minutes' && text.includes('minutes')) chip.classList.add('active');
        else if (cat === 'circulars' && text.includes('circulars')) chip.classList.add('active');
        else if (cat === 'reports' && text.includes('reports')) chip.classList.add('active');
        else chip.classList.remove('active');
    });
    
    searchDocuments();
}

function searchDocuments() {
    const searchVal = document.getElementById('library-search').value.toLowerCase();
    
    let filtered = documentDatabase;
    
    // Filter by category
    if (activeDocumentCategory !== 'all') {
        filtered = filtered.filter(doc => doc.category === activeDocumentCategory);
    }
    
    // Filter by keyword query
    if (searchVal.trim() !== '') {
        filtered = filtered.filter(doc => 
            doc.title.toLowerCase().includes(searchVal) || 
            doc.dept.toLowerCase().includes(searchVal)
        );
    }
    
    populateDocsTable(filtered);
}

function downloadMockFile(title) {
    alert(`Initiating download for:\n"${title}"\n(Mock PDF generated successfully for prototype purposes)`);
}

// 10. Startup Initialization
window.addEventListener('DOMContentLoaded', () => {
    // Initial UI settings
    updateDateBadge();
    lucide.createIcons();
    
    // Logo display handling: Hide SVG fallback if custom logo image loads
    const customLogo = document.getElementById('custom-logo');
    const svgEmblem = document.getElementById('gov-emblem-svg');
    if (customLogo && svgEmblem) {
        // If image is already loaded (cached)
        if (customLogo.complete && customLogo.naturalHeight !== 0) {
            svgEmblem.style.display = 'none';
        } else {
            customLogo.addEventListener('load', () => {
                svgEmblem.style.display = 'none';
            });
            customLogo.addEventListener('error', () => {
                customLogo.style.display = 'none';
                svgEmblem.style.display = 'block';
            });
        }
    }
    
    // Initialize interactive sections
    showNodeDetails('cm');
    activateWorkflowStep(4); // Default to review meeting step
    switchReviewTab(4); // Default to meeting 4
    
    // Load dashboard elements
    initializeCharts();
    populateDistrictTable(districtsLeaderboard);
    populateDocsTable(documentDatabase);
});
