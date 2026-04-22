<!-- converted from Hexa25_ILGC_Project_Report.docx -->


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
# 4. Solution Refinement
The project did not move directly from problem discovery to the final solution. The team's Week 11 materials show a wide spread of alternatives: manual systems, lightweight digital tools, access-control mechanisms, automation-heavy shelves, and database concepts [S2]. The final solution emerged only after comparing these ideas against stakeholder needs, scope discipline, and pilot feasibility.

## 4.1 PDCA Lens
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

Figure 3. Refinement timeline from early problem scouting to the current operational prototype direction [S1][S2][S5][S6].
# 5. Proposed Design (The Proto Section)
## 5.1 System Overview
The proposed prototype is an integrated makerspace operations platform for students, mentors, and admins. Students can discover machines and materials, understand training requirements, book resources, and manage project-related workflows. Mentors can expose availability and participate in guided workflows where technical support is required. Admins can manage catalog data, approvals, notifications, and analytics from the same system.

Figure 4. High-level system architecture for the proposed prototype, showing how user groups connect to operational modules and governance controls.
## 5.2 Subsystem Breakdown
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
## 5.3 Design Rationale
The final design was chosen over simpler alternatives because it closes the loop between awareness, access, execution, and governance. A single booking tool would still leave materials, training, and approvals unresolved. A single inventory tool would still leave mentor support and project workflows outside the system. The integrated design is therefore the first option that matches the full shape of the documented problem.

Figure 5. Current prototype coverage across subsystems, derived from the live application inventory in state.md [S5].
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
## 8.2 Learning from the Process
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

# Appendix A. Source Pack Used for This Report
- [S1] Group 25- SWOT.pptx, Week 6 ideation and prioritization deck.
- [S2] Week_11.pptx, brainstorming, dot-voting, and shortlisted solution concepts.
- [S3] ILGC Presentation Content.docx, synthesized stakeholder and jury-preparation notes.
- [S4] Project Report Template.docx, required report structure and submission sections.
- [S5] state.md, current implemented product scope and feature inventory.
- [S6] roadmap.md, planned next-phase product refinements and implementation logic.
# Appendix B. Priority Matrix Snapshot

# Appendix C. Current Prototype Capability Snapshot

# Appendix D. AI Declaration Prompt Evidence
The uploaded ILGC presentation content explicitly references AI-assisted ideation and root-cause analysis. The preserved prompt evidence includes the following question: "Why do students not use makerspaces despite availability?" [S3]. This report follows that same requirement by disclosing AI usage and pairing it with the human decisions that constrained the outcome.
| Existing approach | What it can do | Why it is insufficient |
| --- | --- | --- |
| WhatsApp / Excel / MS Forms | Accepts lightweight requests and manual coordination. | No live inventory or machine state, weak ownership, and poor auditability. |
| Physical logbooks and slips | Creates a basic record at the point of use. | Not discoverable remotely, error-prone, and hard to analyze over time. |
| Standalone status chart | Improves local visibility of machine availability. | Does not connect bookings, training, or materials in one workflow. |
| QR or ID access-only systems | Helps authenticate or verify access. | Solves entry friction but not planning, guidance, or approvals. |
| Sensor-heavy smart shelves | Could automate inventory tracking. | Higher hardware complexity than needed for a pilot and does not solve coordination alone. |
| Stakeholder | Documented need | Design implication |
| --- | --- | --- |
| Students | Need to know what exists, what is available, and how to access it before arriving. | Prioritize searchable catalogs, machine status, and beginner-friendly guidance. |
| Beginners | Need support before independent use of machines and materials. | Expose training requirements, mentor support, and tutorials inside the workflow. |
| Mentors / faculty | Need clearer coordination around availability, support, and supervised projects. | Support mentor-linked booking and project-level visibility. |
| Admins | Need ownership, inventory visibility, approvals, and usage insights. | Provide structured admin dashboards, approval flows, notifications, and analytics. |
| Version | Core idea | Why it changed | Refined outcome |
| --- | --- | --- | --- |
| v1 | Manual and low-friction coordination tools such as forms, chat, and logbooks. | Too fragmented, weak audit trail, and no live status. | Useful as a baseline but not sufficient as a campus system. |
| v2 | Standalone machine-status or materials-only tools. | Improved one layer but failed to connect discovery, booking, and governance. | Led to a broader systems view. |
| v3 | Centralized information platform for tools, materials, and guidance. | Stronger usability, but limited if approvals and support remained external. | Extended toward integrated workflows. |
| v4 | Integrated Makerspace Hub with booking, training, BOM, notifications, and analytics. | Best fit for stakeholder pain, prototype feasibility, and institutional value. | Chosen final direction. |
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