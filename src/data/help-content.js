// Centralized help content for tooltips throughout the application
export const helpContent = {
  dashboard: {
    executionCount: {
      title: "Execution Count",
      content: "Total number of workflow and script executions today. This includes all completed, failed, and running processes."
    },
    successful: {
      title: "Successful Executions", 
      content: "Number of executions that completed successfully without errors. Success rate is calculated from this metric."
    },
    failed: {
      title: "Failed Executions",
      content: "Number of executions that encountered errors or failures. Use this to monitor system health and identify issues."
    },
    canceled: {
      title: "Canceled Executions",
      content: "Number of executions that were manually stopped or automatically canceled due to timeouts or system constraints."
    },
    quickActions: {
      title: "Quick Actions",
      content: "Common tasks you can perform to get started quickly. These shortcuts help you create new resources without navigating through menus."
    },
    createWorkflow: {
      title: "Create Workflow",
      content: "Launch the visual workflow builder to create automated processes by connecting different actions and triggers."
    },
    environmentVariable: {
      title: "Environment Variable",
      content: "Add secure configuration variables that your workflows and scripts can access, such as API keys or database connections."
    },
    createScript: {
      title: "Create Script",
      content: "Add custom scripts in Python, JavaScript, or Shell that can be executed within your workflows or run independently."
    },
    uploadFile: {
      title: "Upload File",
      content: "Upload files that your workflows can process, such as CSV data, configuration files, or templates."
    },
    executionStatus: {
      title: "Execution Status",
      content: "Current status of this execution: Completed (green), Running (blue), Failed (red), or Pending (yellow)."
    },
    executionProgress: {
      title: "Execution Progress",
      content: "Shows how many workflow nodes have been executed versus the total number of nodes. Progress bar indicates completion percentage."
    },
    executionDetails: {
      title: "Execution Details",
      content: "Click to expand and see detailed information about each execution run, including individual node progress and timing."
    }
  },
  workflows: {
    workflowBuilder: {
      title: "Workflow Builder",
      content: "Visual drag-and-drop interface for creating automation workflows. Connect different nodes to build complex processes."
    },
    nodeTypes: {
      title: "Node Types",
      content: "Different types of actions you can add: Triggers (start), Process (transform data), Actions (send emails), and Complete (end)."
    },
    searchFilter: {
      title: "Search & Filter",
      content: "Find workflows by name, description, or filter by status (Active, Draft, Deactivated, etc.) to organize your automations."
    },
    workflowStatus: {
      title: "Workflow Status",
      content: "Active: Currently running, Draft: Being edited, Deactivated: Stopped, Paused: Temporarily disabled."
    },
    successRate: {
      title: "Success Rate",
      content: "Percentage of successful executions out of total runs. Higher rates indicate more reliable workflows."
    },
    totalRuns: {
      title: "Total Runs",
      content: "Total number of times this workflow has been executed since creation. Shows workflow usage frequency."
    },
    nodeCount: {
      title: "Node Count",
      content: "Number of steps/actions in this workflow. More complex workflows typically have more nodes."
    },
    avgDuration: {
      title: "Average Duration",
      content: "Typical time it takes for this workflow to complete. Use this to optimize performance and set appropriate timeouts."
    },
    workflowActions: {
      title: "Workflow Actions",
      content: "Available actions: View info, Edit workflow, Run workflow (if active), Delete workflow. Each action has specific permissions."
    }
  },
  environment: {
    environmentVariables: {
      title: "Environment Variables",
      content: "Secure storage for configuration data, API keys, database connections, and other sensitive information used by your workflows."
    },
    variableName: {
      title: "Variable Name",
      content: "Unique identifier for this variable. Use uppercase with underscores (e.g., DATABASE_URL, API_KEY) following convention."
    },
    variableValue: {
      title: "Variable Value",
      content: "The actual data stored in this variable. Values are encrypted and can be toggled between hidden and visible for security."
    },
    variableType: {
      title: "Variable Type",
      content: "Data format: String (text), Integer (numbers), URL (web addresses), Boolean (true/false), JSON (structured data)."
    },
    variableScope: {
      title: "Variable Scope",
      content: "Access level: Global (all users and workflows), User (current user only), Session (temporary, current session only)."
    },
    accessCount: {
      title: "Access Count",
      content: "Number of times this variable has been read by workflows or scripts. Helps track usage and identify unused variables."
    },
    lastUsed: {
      title: "Last Used",
      content: "Timestamp when this variable was last accessed. Use this to identify stale variables that might be safe to remove."
    },
    variableActions: {
      title: "Variable Actions",
      content: "Available actions: Edit variable value/settings, Delete variable (be careful - this may break dependent workflows)."
    },
    createVariable: {
      title: "Create Variable",
      content: "Add a new environment variable with secure storage. Choose appropriate type and scope based on your security requirements."
    }
  },
  scripts: {
    scriptsLibrary: {
      title: "Scripts Library",
      content: "Collection of reusable automation scripts in various programming languages. Scripts can be executed independently or within workflows."
    },
    scriptName: {
      title: "Script Name",
      content: "Unique identifier for the script. Use descriptive names with underscores (e.g., csv_processor, email_sender)."
    },
    scriptCategory: {
      title: "Script Category",
      content: "Organizational grouping: Data Processing (ETL, transformations), Communication (emails, notifications), Maintenance (backups, cleanup)."
    },
    scriptPerformance: {
      title: "Performance Metrics",
      content: "Success rate, average execution time, and total runs. Use these metrics to optimize slow scripts and identify reliable ones."
    },
    scriptVersion: {
      title: "Script Version",
      content: "Version number following semantic versioning (major.minor.patch). Increment when making changes to track script evolution."
    },
    scriptSize: {
      title: "Script Size",
      content: "File size in bytes/KB/MB. Larger scripts may take longer to load and execute. Consider optimization for better performance."
    },
    scriptTags: {
      title: "Script Tags",
      content: "Keywords for categorization and search. Add relevant tags like 'csv', 'email', 'backup' to make scripts easier to find."
    },
    scriptActions: {
      title: "Script Actions",
      content: "Available actions: Run script, View analytics, Edit code, Delete script. Running requires appropriate permissions and dependencies."
    },
    importScript: {
      title: "Import Script",
      content: "Upload existing script files from your computer. Supports Python (.py), JavaScript (.js), Shell (.sh), and other common formats."
    },
    createScript: {
      title: "Create Script",
      content: "Write new automation scripts using the built-in code editor. Include proper error handling and documentation for maintainability."
    }
  },
  general: {
    search: {
      title: "Search",
      content: "Type to filter results by name, description, tags, or other relevant fields. Search is case-insensitive and supports partial matches."
    },
    filter: {
      title: "Filter",
      content: "Narrow down results by specific criteria such as status, category, or scope. Combine with search for more precise results."
    },
    status: {
      title: "Status Indicator",
      content: "Current state of this item. Colors indicate: Green (success/active), Red (failed/error), Yellow (warning/pending), Gray (inactive/draft)."
    },
    actions: {
      title: "Actions Menu",
      content: "Available operations for this item. Common actions include view, edit, delete, and run. Some actions may be disabled based on current state."
    },
    timestamp: {
      title: "Timestamp", 
      content: "When this event occurred or item was last modified. Timestamps help track activity and troubleshoot issues chronologically."
    }
  }
};