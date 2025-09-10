export const helpContent = {
  // Dashboard page help content
  dashboard: {
    executionCount: "Total number of workflow executions in the last 24 hours",
    successful: "Number of workflows that completed successfully without errors",
    failed: "Number of workflows that encountered errors and failed to complete",
    canceled: "Number of workflows that were manually stopped or timed out",
    quickActions: {
      createWorkflow: "Start building a new automated workflow with our visual editor",
      environmentVariable: "Add secure configuration values for your workflows",
      createScript: "Write custom JavaScript code to extend workflow functionality", 
      uploadFile: "Upload files to use in your workflows and automations"
    },
    latestExecutions: "Recent workflow runs showing their status and execution details",
    executionDetails: "Click to view detailed execution logs and node-by-node progress"
  },

  // Workflows page help content
  workflows: {
    totalWorkflows: "Total number of workflows created in your workspace",
    activeWorkflows: "Workflows that are currently enabled and can be triggered",
    workflowBuilder: "Visual workflow editor using drag-and-drop nodes to create automations",
    nodeTypes: "Different types of processing nodes you can add to workflows",
    workflowStatus: "Shows whether a workflow is active, paused, or has errors"
  },

  // Environment Variables page help content
  environment: {
    name: "The variable name used to reference this value in workflows and scripts",
    type: "Secret values are encrypted, Config values are plain text configuration",
    scope: "Global variables are available to all workflows, Project variables are workspace-specific",
    accessCount: "Number of times this variable has been used by workflows",
    lastUsed: "Most recent date and time this variable was accessed",
    actions: "Edit, delete, or toggle visibility of environment variables"
  },

  // Scripts page help content  
  scripts: {
    name: "The script name and description for identification in workflows",
    language: "Programming language used (JavaScript, Python, etc.)",
    context: "Where the script runs - Node.js server, browser, or edge functions",
    status: "Current state - Active (ready to use), Inactive, or Error (needs fixing)",
    lastModified: "Most recent edit date and author information",
    actions: "Edit script code, test execution, or delete the script"
  },

  // General UI elements
  ui: {
    themeToggle: "Switch between light, dark, or system theme preferences",
    notifications: "View system alerts, workflow status updates, and important messages",
    userMenu: "Access account settings, documentation, and sign out options",
    search: "Search across workflows, scripts, and environment variables",
    filter: "Filter items by type, status, or other criteria"
  }
};