<!-- converted from Hexa25_ILGC_Project_Report_20260422_235500.docx -->


Plaksha Makerspace Hub
ILGC-2 Report: Solving the Makerspace Accessibility and Information Gap through an integrated operational platform

Project Title: Plaksha Makerspace Hub
Team Number: 25
Date: 22 April 2026
Team Members and Roles
Dhiraj Deva - Problem framing and coordination-flow ideation
Mauryan Jaiswal - Inventory automation and operations logic
Suryaansh - Core web-product architecture and training enablement
Greeshma Tanvi Reddy Tadi - Access verification and QR-driven interaction design
Priyanka Chopurala - Service-design alternatives and user-side workflow exploration
Harshil Jain - Structured data and booking-system thinking
Prepared from the shared HEXA25 evidence pack and the current working prototype repository.

# Contents

If the table of contents does not populate automatically, open the file in Word and update fields once.

# 1. Executive Summary
Hexa25's project responds to a recurring operational problem at Plaksha Makerspace: students, mentors, and staff do not have a single reliable system to discover tools, check machine availability, understand training requirements, view material stock, and coordinate project approvals. The shared evidence pack repeatedly points to fragmented access, repeated uncertainty, and lost time as the dominant user experience.
The team's answer is an integrated digital hub rather than a single-purpose fix. The proposed platform combines machine and material discovery, mentor-supported booking, project and BOM workflows, approval stages, notifications, and analytics in one operational layer. This allows the makerspace to function as a coordinated campus resource rather than a set of disconnected manual interactions.
This direction is already feasible. The current prototype scope confirms implemented modules for authentication, catalogs, bookings, project management, BOM handling, material request flows, mentor availability, training records, notifications, and analytics. The report therefore argues not only that the solution is desirable, but also that it is buildable, scalable, and institutionally useful.
### Expected outcome:
- Reduce student uncertainty before a makerspace visit by making access conditions visible in advance.
- Lower coordination load on mentors and admins through structured booking, approval, and notification workflows.
- Improve utilization and planning through analytics on machines, bookings, material demand, and user activity.
- Create a platform that can grow from a prototype into a campus operations layer with public showcase potential.
# 2. Background Research
## 2.1 Problem Identification and Opportunity Framing
The Week 6 team deck shows that the group initially scanned several campus opportunities across different zones before converging on the makerspace challenge. A weighted priority matrix compared lost-and-found management, campus accessibility gaps, a professors' repository, and the makerspace information gap against ease of implementation, feasibility, and cost [S1].
Although the professors' repository problem scored highest numerically, the makerspace challenge emerged as the most strategically aligned opportunity. It sat at the intersection of strong campus relevance, clear student pain, and the team's ability to deliver an actionable digital prototype. In other words, the final choice was driven by score plus fit, not score alone.

Figure 1. Opportunity prioritization across shortlisted campus problems, synthesized from the Week 6 SWOT deck [S1].
## 2.2 Existing Solutions and What They Miss

The team's own ideation makes the gap clear: almost every alternative addressed only one slice of the problem. Some ideas improved discoverability, some improved verification, and some improved automation, but none created a full makerspace workflow from awareness to booking to material use to reporting. The background research therefore pushed the team away from fragmented fixes and toward an integrated platform strategy.
## 2.3 Gap Analysis
- Fragmentation: existing workarounds solve isolated tasks rather than the full user journey.
- Low visibility: students cannot reliably know machine status, material stock, or support availability before arriving.
- Weak onboarding: beginners need guidance, tutorials, and training clarity, not only access control.
- No operational memory: manual methods produce weak history, low accountability, and limited data for planning.
- Poor scalability: once makerspace usage increases, disconnected channels become slower and less trustworthy.

Figure 2. Solution clusters that emerged from Week 11 brainstorming, showing how early ideas spread across visibility, coordination, automation, and guidance [S2].
## 2.4 SWOT Analysis of the Selected Direction
The original SWOT exercise for the makerspace challenge is strong because it does not describe the idea as universally positive. It correctly identifies that a centralized platform can create clarity and engagement, but only if the data stays current and someone owns the operating discipline behind it [S1]. That makes SWOT especially important here: the platform is not merely a design artifact, it is an operational system whose value rises or collapses based on upkeep.

Figure 3. SWOT matrix for the selected makerspace platform direction, synthesized from the Week 6 SWOT deck and interpreted against the current prototype [S1][S5].

# 3. Stakeholder Feedback on the Proposed Solution
The local evidence pack documents direct observation of makerspace use, repeated site visits, informal interaction with students, admins, and faculty, and a presentation script prepared around synthesized survey and interview findings [S3]. The raw survey spreadsheet was not preserved in the uploaded folder, but the available documents still capture the dominant stakeholder concerns with enough consistency to guide design.
## 3.1 Methods Used
- Repeated makerspace visits to observe how students search for tools, plan work, and request access.
- Informal interviews and contextual conversations with students, admins, and faculty mentioned in the presentation content [S3].
- Team-level synthesis through SWOT analysis, dot voting, and problem reframing [S1][S2].
- Prototype-grounded review using the current implemented platform scope and roadmap [S5][S6].
## 3.2 Stakeholder Needs Summary

## 3.3 Representative Feedback Excerpts
"We observed how students try to prototype and the friction they face in accessing tools and materials." [S3]
"Through surveys, informal interviews, and observations, we identified a recurring issue - lack of a centralized system." [S3]
"Feedback showed strong agreement, especially from students and admins." [S3]
Together, these excerpts point toward a solution that must do more than list resources. Stakeholders are asking for a system that reduces planning uncertainty, lowers coordination overhead, and makes the makerspace easier to navigate for both new and experienced users.
## 3.4 Stakeholder-to-Feature Mapping

# 4. Solution Refinement
The project did not move directly from problem discovery to the final solution. The team's Week 11 materials show a wide spread of alternatives: manual systems, lightweight digital tools, access-control mechanisms, automation-heavy shelves, and database concepts [S2]. The final solution emerged only after comparing these ideas against stakeholder needs, scope discipline, and pilot feasibility.

## 4.1 Concept Options and Final Homepage Direction
The design exploration did not stop at workflow logic. The project also generated three homepage directions aligned to the live makerspace domain: Foundry Executive, Parchment and Steel, and Vanguard Runway. The user selected Concept A, Foundry Executive, and it was later rolled across the project with adaptations for public-safe storytelling [S7][S8].

## 4.2 PDCA Lens
- Plan: identify the campus problem space and shortlist the most actionable opportunity.
- Do: generate multiple solution types and map them against feasibility, cost, and user value.
- Check: compare alternatives against observed stakeholder pain and the need for an end-to-end workflow.
- Act: converge on the integrated platform and extend the prototype toward governance-heavy features such as approvals and mentor-linked booking.
### Primary reasons for change during refinement:
- Feedback: stakeholders needed one system, not multiple disconnected fixes.
- Failure: manual or single-purpose tools could not hold discovery, execution, and tracking together.
- Cost: high-hardware automation ideas were less suitable for a rapid pilot than a software-first platform.
- Skills: the team could deliver a web-based prototype faster than a sensor-heavy infrastructure change.
- Time: an integrated but software-first prototype offered the highest value within academic constraints.
## 4.3 Justified Changes from Selected Concept to Final Public Experience
The exemplar portfolio spends significant space on design changes between the proposed interface and the final build. The same discipline applies here. Concept A was not copied directly. It was adapted so that the public homepage could reflect the chosen visual logic without exposing internal operational dashboard content.


Figure 4. Refinement timeline from early problem scouting to the current operational prototype direction [S1][S2][S5][S6].
# 5. Proposed Design (The Proto Section)
## 5.1 Detailed Design Brief

## 5.2 System Overview
The proposed prototype is an integrated makerspace operations platform for students, mentors, and admins. Students can discover machines and materials, understand training requirements, book resources, and manage project-related workflows. Mentors can expose availability and participate in guided workflows where technical support is required. Admins can manage catalog data, approvals, notifications, and analytics from the same system.

Figure 5. High-level system architecture for the proposed prototype, showing how user groups connect to operational modules and governance controls.
## 5.3 Detailed Design Specification

## 5.4 Screen-Level Design Brief

## 5.5 Subsystem Breakdown
### Discovery and Catalog
The catalog layer provides searchable machine and material records, category filters, specifications, safety guidance, and stock visibility. This directly addresses the documented information gap and makes remote planning possible for students before a makerspace visit.
### Execution and Access
The execution layer handles machine booking, mentor session booking, training gates, overlap detection, and mentor-supported machine workflows. This turns access into a structured, policy-aware process rather than an ad-hoc coordination effort.
### Project and BOM Workflows
The project subsystem supports team creation, mentor assignment, BOM creation, versioned material planning, and approval-driven request flows. This matters because the makerspace problem is not only about access to tools; it is also about managing project execution and material consumption with accountability.
### Operations, Governance, and Analytics
Notifications, low-stock visibility, role-based dashboards, and analytics create an operations layer for admins. Instead of reacting manually to every booking, request, or shortage, the makerspace gains a measurable operating picture.
### Public Discovery and Future Layer
The next planned increment adds public ongoing-project discovery and visibility controls, allowing the makerspace to function not only as an internal service but also as a campus engagement surface [S6].
## 5.6 Technical Architecture and Stack

## 5.7 Core Data Entities and Responsibilities

## 5.8 Workflow Specifications
The detailed technical behavior of the solution is best understood through its governed workflows. The platform is intentionally designed so that discovery, validation, execution, review, and feedback remain inside one system rather than being split across chats, forms, spreadsheets, and in-person clarification.


Figure 6. Core operational workflow model showing how the platform moves users from visibility to validated execution and feedback.
## 5.9 Validation and Testing Plan
The exemplar report moves beyond design intent and defines how the solution should be tested. The same principle is important here. Because this prototype already exists in code, the validation plan can combine implemented evidence with pilot-stage measurement.

### Proposed pilot metrics:
- Time taken for a student to identify a suitable machine and confirm whether they are eligible to use it.
- Booking completion rate without mentor/admin intervention for standard use cases.
- Turnaround time from BOM submission to material-request decision.
- Accuracy of low-stock awareness as perceived by students versus actual inventory records.
- Public engagement with visible projects after the public-project route is published.
## 5.10 Design Rationale
The final design was chosen over simpler alternatives because it closes the loop between awareness, access, execution, and governance. A single booking tool would still leave materials, training, and approvals unresolved. A single inventory tool would still leave mentor support and project workflows outside the system. The integrated design is therefore the first option that matches the full shape of the documented problem.

Figure 7. Current prototype coverage across subsystems, derived from the live application inventory in state.md [S5].
# 6. Materials and Resources

Estimated pilot total: Rs 6,500
This estimate intentionally reflects a software-first pilot. It assumes academic or free tiers for hosting and infrastructure and allocates cost only where the campus rollout needs physical supports such as signage and onboarding collateral.
# 7. Work Done by Team Members (Evidence-Based)

The uploaded evidence pack preserves ideation ownership clearly. The implemented prototype represents a combined team effort, but the local artifacts do not break final development work down by commit author.
# 8. Difficulties Faced and Learning
## 8.1 Difficulties Faced
- The most feasible solution numerically was not automatically the most meaningful one, so the team had to balance scoring with strategic relevance.
- The makerspace problem spans visibility, access, training, material use, and governance, which made a narrow solution feel incomplete.
- The shared evidence pack preserved synthesized feedback more strongly than raw survey sheets, requiring careful reconstruction of the narrative from multiple artifacts.
- A good pilot needed to stay implementable within student constraints without collapsing into a weak, single-purpose tool.
## 8.2 Technical Trade-offs and Constraints
- A software-first pilot was favored over hardware-heavy automation because it matched academic time and skill constraints better.
- Public pages had to be adapted away from sensitive dashboard previews while preserving the chosen design language.
- The current prototype is strong in operational flows, but exact pilot metrics still depend on structured user deployment and measurement.
- Purchase-order lifecycle work remains a clear technical gap, which affects how far material governance can go in version 1.0.
## 8.3 Learning from the Process
- Problem selection must weigh institutional value and ownership, not only spreadsheet scores.
- Campus products fail when they digitize one step but ignore the surrounding workflow.
- Beginner onboarding and admin governance are product requirements, not optional extras.
- Analytics create institutional legitimacy because they turn usage anecdotes into visible evidence.
- A strong prototype is one that can already operate in pieces while still pointing clearly to version 2.0.
# 9. Declaration of AI Tool(s) Usage

Example documented ideation prompt from the shared materials: "Why do students not use makerspaces despite availability?" [S3]. The final direction was not accepted automatically; it was filtered through team observation, SWOT reasoning, and feasibility checks.
# 10. Closing
## 10.1 Conclusion
The Makerspace Accessibility and Information Gap is a strong ILGC problem because it is visible, actionable, and institutionally significant. The team's final answer, an integrated makerspace hub, is credible because it responds directly to stakeholder pain, survives comparison with simpler alternatives, and already exists in prototype form across multiple operational modules.
## 10.2 Future Recommendations (Version 2.0)
- Add public ongoing-project discovery to strengthen student engagement and showcase campus making culture.
- Introduce QR-assisted check-in and contextual machine guidance at the point of use.
- Add deeper inventory intelligence such as consumption forecasting and replenishment recommendations.
- Extend the system to workshops, events, and purchase-order workflows once core operations stabilize.
- Integrate richer mentor scheduling and advanced administrative reporting for funding and planning decisions.
## 10.3 References
[S1] Group 25- SWOT.pptx, Week 6 ideation and prioritization deck.
[S2] Week_11.pptx, brainstorming, dot-voting, and shortlisted solution concepts.
[S3] ILGC Presentation Content.docx, synthesized stakeholder and jury-preparation notes.
[S4] Project Report Template.docx, required report structure and submission sections.
[S5] state.md, current implemented product scope and feature inventory.
[S6] roadmap.md, planned next-phase product refinements and implementation logic.
[S7] chats/main-page-redesign-samples/01-foundry-executive.html, selected Concept A homepage prototype.
[S8] agent-control/.agents/knowledge/Tasks/task-2026-04-21-concept-a-rollout.md, evidence of Concept A selection and rollout.
[S9] src/app/page.tsx, current public homepage implementation derived from the selected concept.
[S10] prisma/schema.prisma, current domain entities and operational data model.

# Appendix A. Source Pack Used for This Report
- [S1] Group 25- SWOT.pptx, Week 6 ideation and prioritization deck.
- [S2] Week_11.pptx, brainstorming, dot-voting, and shortlisted solution concepts.
- [S3] ILGC Presentation Content.docx, synthesized stakeholder and jury-preparation notes.
- [S4] Project Report Template.docx, required report structure and submission sections.
- [S5] state.md, current implemented product scope and feature inventory.
- [S6] roadmap.md, planned next-phase product refinements and implementation logic.
- [S7] chats/main-page-redesign-samples/01-foundry-executive.html, selected Concept A homepage prototype.
- [S8] agent-control/.agents/knowledge/Tasks/task-2026-04-21-concept-a-rollout.md, evidence of Concept A selection and rollout.
- [S9] src/app/page.tsx, current public homepage implementation derived from the selected concept.
- [S10] prisma/schema.prisma, current domain entities and operational data model.
# Appendix B. Priority and SWOT Snapshot


# Appendix C. Concept Selection and Finalization Snapshot


# Appendix D. Current Prototype Capability Snapshot

# Appendix E. Roadmap and Validation Snapshot


# Appendix F. AI Declaration Prompt Evidence
The uploaded ILGC presentation content explicitly references AI-assisted ideation and root-cause analysis. The preserved prompt evidence includes the following question: "Why do students not use makerspaces despite availability?" [S3]. This report follows that same requirement by disclosing AI usage and pairing it with the human decisions that constrained the outcome.
| Existing approach | What it can do | Why it is insufficient |
| --- | --- | --- |
| WhatsApp / Excel / MS Forms | Accepts lightweight requests and manual coordination. | No live inventory or machine state, weak ownership, and poor auditability. |
| Physical logbooks and slips | Creates a basic record at the point of use. | Not discoverable remotely, error-prone, and hard to analyze over time. |
| Standalone status chart | Improves local visibility of machine availability. | Does not connect bookings, training, or materials in one workflow. |
| QR or ID access-only systems | Helps authenticate or verify access. | Solves entry friction but not planning, guidance, or approvals. |
| Sensor-heavy smart shelves | Could automate inventory tracking. | Higher hardware complexity than needed for a pilot and does not solve coordination alone. |
| Strengths | Weaknesses | Opportunities | Threats |
| --- | --- | --- | --- |
| Improves resource visibility and utilization, reducing confusion and inefficiencies.
Low-to-moderate technology implementation cost for a pilot-stage solution.
Encourages innovation and student engagement by making the makerspace easier to approach. | Needs regular data updates to remain trustworthy.
Requires staff onboarding and disciplined digital ownership.
Booking-system integration and approval-state coordination increase product complexity. | Can include tutorials, onboarding, and project showcases for beginners.
Can become a collaboration hub for student clubs, teams, and startups.
Can produce analytics that justify funding, staffing, and makerspace expansion. | Outdated data would quickly erode trust in the platform.
Low awareness could preserve underutilization even after launch.
The platform could stall without clear administrative ownership and upkeep. |
| Stakeholder | Documented need | Design implication |
| --- | --- | --- |
| Students | Need to know what exists, what is available, and how to access it before arriving. | Prioritize searchable catalogs, machine status, and beginner-friendly guidance. |
| Beginners | Need support before independent use of machines and materials. | Expose training requirements, mentor support, and tutorials inside the workflow. |
| Mentors / faculty | Need clearer coordination around availability, support, and supervised projects. | Support mentor-linked booking and project-level visibility. |
| Admins | Need ownership, inventory visibility, approvals, and usage insights. | Provide structured admin dashboards, approval flows, notifications, and analytics. |
| Stakeholder | Pain or expectation | Product response |
| --- | --- | --- |
| Students planning a visit | Need to know what exists, what is available, and what they are allowed to use before reaching the makerspace. | Searchable catalogs, machine status, material visibility, public projects, and a clear sign-in path. |
| Beginners and first-time users | Need guidance, training cues, and a lower-friction way to understand how makerspace processes work. | Training gates, mentor-linked workflows, safety/context information, and onboarding-oriented content. |
| Mentors and faculty | Need predictable coordination around availability, support sessions, and supervised project execution. | Availability management, mentor session booking, supervised project views, and approval handoffs. |
| Admins and operations owners | Need inventory governance, approval visibility, usage analytics, and low-stock awareness. | Admin dashboards, request queues, analytics, notifications, and role-protected management pages. |
| Version | Core idea | Why it changed | Refined outcome |
| --- | --- | --- | --- |
| v1 | Manual and low-friction coordination tools such as forms, chat, and logbooks. | Too fragmented, weak audit trail, and no live status. | Useful as a baseline but not sufficient as a campus system. |
| v2 | Standalone machine-status or materials-only tools. | Improved one layer but failed to connect discovery, booking, and governance. | Led to a broader systems view. |
| v3 | Centralized information platform for tools, materials, and guidance. | Stronger usability, but limited if approvals and support remained external. | Extended toward integrated workflows. |
| v4 | Integrated Makerspace Hub with booking, training, BOM, notifications, and analytics. | Best fit for stakeholder pain, prototype feasibility, and institutional value. | Chosen final direction. |
| Concept | Core language | Primary strength | Primary risk | Decision |
| --- | --- | --- | --- | --- |
| Concept A - Foundry Executive | Light command-console hierarchy with KPI-first structure and operational scanning. | Strong fit for makerspace workflows, role clarity, and system trust. | Can feel too dashboard-sensitive if copied directly onto public pages. | Selected and rolled out as the base visual/structural direction [S7][S8]. |
| Concept B - Parchment and Steel | Editorial, archival, operations-board aesthetic with strong narrative rhythm. | Excellent for storytelling and institutional tone. | Less efficient for dense operational actions and fast scanning. | Useful reference for content framing, but not chosen as the primary system language. |
| Concept C - Vanguard Runway | High-tempo, split-layout hierarchy with strong motion and visual energy. | Memorable and striking for promotional presentation. | More presentation-led than governance-led for a makerspace operations system. | Rejected as the core direction because operational clarity mattered more than spectacle. |
| Aspect | Concept A prototype | Final implementation | Justification |
| --- | --- | --- | --- |
| Public homepage structure | Concept A used a KPI-heavy operations preview with filters, inventory table, alerts, and quick actions. | The live homepage keeps the command-surface logic but shifts to a narrative hero, role journey, and public-project discovery. | This preserves operational credibility while preventing public visitors from seeing internal dashboard-style content [S7][S8][S9]. |
| Primary action pattern | Concept A centered on direct workspace entry and operational scanning. | The final page keeps Sign In as the main action but adds a Browse Public Projects path for unauthenticated users. | The system serves both internal operators and curious public visitors, so the public route must support both intents. |
| Information density | The original concept presented machine/material data directly on the homepage. | The final implementation moves operational detail into authenticated routes and uses concise summaries on public surfaces. | This is safer, clearer, and more appropriate for a campus-facing front door. |
| Visual tone | Concept A was light, crisp, and command-oriented. | The final implementation translates that hierarchy into a more cinematic, darker brand language used across the project. | The rollout kept the operational grammar of Concept A while adapting it to a stronger institutional identity [S8][S9]. |
| Design brief dimension | Resolved design brief |
| --- | --- |
| Core problem | Students, mentors, and admins lack one reliable system for discovery, access, approvals, and operational tracking in the makerspace. |
| Primary users | Students, beginner makers, mentors/faculty, and admin operators. |
| Primary objective | Create a single operational layer that reduces uncertainty before a visit and improves coordination during project execution. |
| Desired behavior change | Move users from ad-hoc, channel-by-channel coordination to a structured discover-book-build-govern workflow. |
| Success condition | Users can discover resources, understand eligibility, book support, manage projects/BOMs, and receive clear operational feedback without manual confusion. |
| Non-negotiables | Role-aware access control, live operational status, beginner guidance, project accountability, and public/private separation. |
| Delivery constraints | The solution must remain software-first, pilot-feasible, responsive, and compatible with the current Next.js + Prisma stack. |
| Specification area | Required behavior | Why it matters | Evidence base |
| --- | --- | --- | --- |
| Information visibility | Machine and material records must expose key operating data such as status, location, training needs, stock, and threshold. | The problem begins with uncertainty before arrival. | Catalog routes and detail pages in the current prototype [S5]. |
| Guided access | Booking must enforce future-only scheduling, machine availability, overlap checks, and training requirements. | Access without rules recreates friction in a different form. | Booking flows and action-layer constraints [S5]. |
| Mentor-supported workflows | Support-required machines must be able to reserve machine plus mentor together. | Some tools cannot be treated as self-serve resources. | Roadmap direction and schema support flag [S6][S10]. |
| Project accountability | Projects must support members, mentors, BOM versions, and approval-linked request history. | The makerspace is project-driven, not only transaction-driven. | Project/BOM scope in the current prototype [S5]. |
| Governance and permissions | Admin and mentor actions must be separated through role-aware routing and server-side permission checks. | Operational trust depends on controlled actions. | Middleware, guards, and admin/mentor routes [S5]. |
| Public storytelling | Public users must be able to understand the makerspace and browse public projects without accessing sensitive operational data. | The platform should also act as an engagement surface. | Homepage and public-project direction [S6][S8][S9]. |
| Accessibility and responsiveness | The interface should preserve visible focus states, keyboard clarity, responsive layout behavior, and reduced-motion safety. | The audience includes different user types and devices. | Concept and implementation patterns in the chosen public route [S7][S9]. |
| Operational resilience | Public pages must fail gracefully when live project data is unavailable. | A makerspace front door cannot disappear during infrastructure issues. | Homepage fallback pattern in the live implementation [S9]. |
| Screen / surface | Primary audience | Purpose | Key design decision |
| --- | --- | --- | --- |
| Public homepage | Visitors and prospective users | Explain the platform, clarify role journeys, and surface public projects. | Narrative hero, operational flow card, role cards, and public showcase entry points. |
| Sign-in and auth entry | Students, mentors, admins | Move users into the correct protected workspace with minimum confusion. | Clear brand continuity, strong primary action, and role-safe access handling. |
| Dashboard | Authenticated users by role | Summarize the most relevant tasks, risks, and actions for each user type. | Different KPI and workflow emphasis for students, mentors, and admins. |
| Machine and material catalogs | Students and admins | Support remote planning through search, filtering, and detail visibility. | Status, location, thresholds, specs, and training clues presented before action. |
| Booking flow | Students and mentors | Convert intent into valid reservations with policy-aware checks. | Dual-tab booking, overlap detection, training checks, and mentor linkage where required. |
| Project and BOM flows | Student teams, mentors, admins | Connect project execution with resource planning and approvals. | Member roles, BOM versioning, request lifecycle, and notification events. |
| Admin operations pages | Admins | Oversee users, machines, materials, requests, training, and analytics from one control layer. | Structured review queues and management surfaces instead of scattered manual processes. |
| Layer | Current choice | Technical role |
| --- | --- | --- |
| Presentation layer | Next.js App Router with React and TypeScript | Supports route-based public and authenticated experiences in one codebase. |
| UI primitives | Custom components in src/components/ui | Provides reusable cards, buttons, tables, tabs, forms, and layout surfaces. |
| Server logic | Server actions in src/app/actions | Holds workflow rules for bookings, projects, BOMs, approvals, notifications, and analytics. |
| Data model | Prisma with PostgreSQL | Stores users, machines, materials, bookings, projects, BOMs, requests, training, and notifications. |
| Authentication | NextAuth with Prisma adapter | Enables managed sessions and role-aware access. |
| Permissions and resilience | Middleware, auth guards, and rate limiting | Protects routes, enforces roles, and reduces abuse on high-frequency endpoints. |
| Communication | In-app notifications with optional email provider path | Supports operational awareness and future transactional communications. |
| Entity | Purpose | Why it matters in the workflow |
| --- | --- | --- |
| User | Identity, role, and system participation | Connects to bookings, trainings, projects, availability, approvals, and notifications. |
| Machine | Tool inventory and access constraints | Carries status, location, pricing, specifications, safety, and mentor/training requirements. |
| Material | Consumable inventory and stock governance | Tracks quantity, threshold, pricing, and issue patterns. |
| Booking | Time-bound reservation record | Links users to machines and/or mentors with status and conflict rules. |
| Training | Capability gate for machine use | Validates whether a user is allowed to book a training-required machine. |
| Project | Team-level making activity | Holds mentor assignment, members, BOM history, and visibility intent. |
| ProjectMember | Role inside a project | Separates leads from members for permission-sensitive actions. |
| Bom and BomItem | Structured material planning | Versioned project resource plan that can flow into approvals and requests. |
| MaterialRequest | Operational request and issue lifecycle | Tracks approval, issuance, and requester/approver metadata. |
| MentorAvailability | Support-slot publication | Allows mentors to expose recurring or one-off time windows. |
| Notification | Workflow awareness record | Delivers state changes back to the relevant actors. |
| Workflow | Actor sequence | Critical gate | Expected output |
| --- | --- | --- | --- |
| Machine discovery to booking | Student explores catalog, opens details, checks eligibility, and books an available slot. | Availability, future date, overlap, and training validation. | Confirmed or pending booking plus notification-ready audit trail. |
| Mentor-supported machine booking | Student chooses a machine that requires support and reserves both machine and mentor. | Machine + mentor conflict checks and mandatory mentor selection. | A single governed reservation for advanced or supervised tool use. |
| Project to BOM to material request | Team lead creates a project, assembles BOM items, submits for approval, and triggers request handling. | Version control, approver identity, admin gating, and quantity/stock logic. | Trackable resource planning instead of ad-hoc asking. |
| Public project storytelling | Public visitor browses visible projects without entering protected operational areas. | Visibility controls and safe public data boundaries. | Campus-facing discovery and engagement layer for makerspace work. |
| Validation layer | What to check | Current evidence | Pilot-stage extension |
| --- | --- | --- | --- |
| Functional workflow validation | Confirm route and action coverage for auth, booking, projects, BOMs, materials, notifications, and analytics. | Documented implemented feature inventory [S5]. | Run representative student, mentor, and admin task paths end to end during pilot. |
| Permission and safety validation | Verify that public, mentor, and admin surfaces remain correctly isolated. | Role-aware route protection and auth-guard logic documented in project state [S5]. | Attempt unauthorized access paths and confirm they fail safely. |
| Data-model validation | Check that entities, statuses, and relationships support the planned workflows. | Current schema and roadmap expansion notes [S6][S10]. | Test lifecycle edges such as partial issuance, BOM approval, and mentor-linked booking. |
| Design validation | Measure whether the selected design language preserves clarity on public and authenticated surfaces. | Concept A selection and rollout evidence [S7][S8][S9]. | Ask users to complete discovery and sign-in tasks while recording confusion points and completion time. |
| Pilot success metrics | Track operational improvement after deployment. | Current prototype provides the required modules but not yet a full pilot dataset. | Measure discovery time, booking completion, approval turnaround, low-stock awareness, and project-publication engagement. |
| Material / Tool / Resource | Description | Estimated cost |
| --- | --- | --- |
| Laptop and internet access | Existing team development setup | Rs 0 |
| Hosting and deployment | Prototype-grade hosting on free/student tier | Rs 0 |
| Database and auth services | Prototype tier for pilot validation | Rs 0 |
| QR labels and signage | Machine and material navigation aids | Rs 1,500 |
| Onboarding posters and guides | Printed quick-start and safety guidance | Rs 1,000 |
| Domain, email, and ops reserve | Pilot-ready deployment buffer | Rs 2,000 |
| Contingency | Unexpected setup and testing requirements | Rs 2,000 |
| Member | Primary contribution | Evidence |
| --- | --- | --- |
| Dhiraj Deva | Problem framing and coordination-flow ideation | Week_11 brainstorming board: MS Forms and chat-based booking alternatives. |
| Mauryan Jaiswal | Inventory automation and operations logic | Week_11 brainstorming board: chart system and automated inventory shelf concepts. |
| Suryaansh | Core web-product architecture and training enablement | Week_11 brainstorming board: web app, machine status, and training-module directions. |
| Greeshma Tanvi Reddy Tadi | Access verification and QR-driven interaction design | Week_11 brainstorming board: face-scan verification and QR inventory ideas. |
| Priyanka Chopurala | Service-design alternatives and user-side workflow exploration | Week_11 brainstorming board: physical logbook, slot-slip, and chatbot alternatives. |
| Harshil Jain | Structured data and booking-system thinking | Week_11 brainstorming board: materials database and ID-based booking concepts. |
| Tool | Purpose | Human decision applied |
| --- | --- | --- |
| ChatGPT (GPT-5.3) | Brainstorming problem causes, presentation structuring, and solution comparison. | The team filtered outputs against on-ground observation, stakeholder context, and campus feasibility before accepting any recommendation. |
| GitHub Copilot (GPT-5.4) | Prototype implementation support, codebase summarization, chart generation, and Word-report assembly. | All facts were constrained to the uploaded project material and the live codebase; the final report structure and wording were human-reviewed and edited. |
| Problem | Composite score | Interpretation |
| --- | --- | --- |
| Professors repository | 15 | Highest raw feasibility score but lower strategic alignment for this team and challenge framing. |
| Lost-and-found management | 13 | Operationally clear and feasible, but less connected to makerspace impact. |
| Makerspace accessibility and information gap | 12 | Chosen because it combined clear pain, digital feasibility, and broader institutional value. |
| Inclusive infrastructure | 9 | High social importance but slower and more infrastructure-heavy to pilot quickly. |
| SWOT quadrant | Detailed interpretation |
| --- | --- |
| Strengths | Improves resource visibility and utilization, reducing confusion and inefficiencies.; Low-to-moderate technology implementation cost for a pilot-stage solution.; Encourages innovation and student engagement by making the makerspace easier to approach. |
| Weaknesses | Needs regular data updates to remain trustworthy.; Requires staff onboarding and disciplined digital ownership.; Booking-system integration and approval-state coordination increase product complexity. |
| Opportunities | Can include tutorials, onboarding, and project showcases for beginners.; Can become a collaboration hub for student clubs, teams, and startups.; Can produce analytics that justify funding, staffing, and makerspace expansion. |
| Threats | Outdated data would quickly erode trust in the platform.; Low awareness could preserve underutilization even after launch.; The platform could stall without clear administrative ownership and upkeep. |
| Concept | Decision summary | How it informed the final system |
| --- | --- | --- |
| Concept A - Foundry Executive | Selected | Provided the core operational hierarchy and role-aware command-surface logic for the final implementation [S7][S8][S9]. |
| Concept B - Parchment and Steel | Not selected | Remains useful as a reference for storytelling and documentation tone. |
| Concept C - Vanguard Runway | Not selected | Helped test the upper bound of visual energy but was not the best operational fit. |
| Aspect | Finalization logic |
| --- | --- |
| Public homepage structure | This preserves operational credibility while preventing public visitors from seeing internal dashboard-style content [S7][S8][S9]. |
| Primary action pattern | The system serves both internal operators and curious public visitors, so the public route must support both intents. |
| Information density | This is safer, clearer, and more appropriate for a campus-facing front door. |
| Visual tone | The rollout kept the operational grammar of Concept A while adapting it to a stronger institutional identity [S8][S9]. |
| Subsystem | Current status | Evidence base |
| --- | --- | --- |
| Authentication and role control | Implemented | state.md [S5] |
| Machine and material catalogs | Implemented | state.md [S5] |
| Booking workflows | Implemented | state.md [S5] |
| Projects and BOMs | Implemented | state.md [S5] |
| Material request approvals | Implemented with minor UI gap | state.md [S5] |
| Mentor availability and training | Implemented | state.md [S5] |
| Notifications and analytics | Implemented | state.md [S5] |
| Purchase orders | Placeholder / future work | state.md [S5] |
| Phase | Focus | Deliverables | Acceptance view |
| --- | --- | --- | --- |
| Phase 1 | Data model and validation foundation | New material-request statuses, BOM approval metadata, mentor-support flag, and validation updates. | Schema compiles cleanly and new constraints map safely to existing workflows. |
| Phase 2 | BOM allocation workflow | Student/mentor request submission, BOM approver review, and admin-stage gating. | Requests cannot bypass the BOM approval stage before admin action. |
| Phase 3 | Mentor-supported machine booking | Machine flagging, mentor requirement enforcement, dual conflict checks, and single reservation persistence. | Support-required bookings fail safely when no mentor is selected. |
| Phase 4 | Public project discovery | Visibility controls, public projects route, and landing-page integration. | Visitors can browse public projects with no auth regression. |
| Phase 5 | QA and stabilization | Permission checks, workflow regression review, and state-document updates. | No unauthorized bypass and no regressions in existing core workflows. |
| Validation layer | Current evidence | Next measurement step |
| --- | --- | --- |
| Functional workflow validation | Documented implemented feature inventory [S5]. | Run representative student, mentor, and admin task paths end to end during pilot. |
| Permission and safety validation | Role-aware route protection and auth-guard logic documented in project state [S5]. | Attempt unauthorized access paths and confirm they fail safely. |
| Data-model validation | Current schema and roadmap expansion notes [S6][S10]. | Test lifecycle edges such as partial issuance, BOM approval, and mentor-linked booking. |
| Design validation | Concept A selection and rollout evidence [S7][S8][S9]. | Ask users to complete discovery and sign-in tasks while recording confusion points and completion time. |
| Pilot success metrics | Current prototype provides the required modules but not yet a full pilot dataset. | Measure discovery time, booking completion, approval turnaround, low-stock awareness, and project-publication engagement. |