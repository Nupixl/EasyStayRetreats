#!/bin/bash

# Webflow-First Development Workflow Script
# This script automates the Webflow component development process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to sync Webflow components
sync_components() {
    print_status "Syncing components from Webflow..."
    
    if command_exists webflow; then
        webflow devlink sync
        print_success "Components synced successfully!"
    else
        print_error "Webflow CLI not found. Please install it first."
        exit 1
    fi
}

# Function to start development server
start_dev() {
    print_status "Starting development server..."
    
    if command_exists npm; then
        npm run dev
    else
        print_error "npm not found. Please install Node.js first."
        exit 1
    fi
}

# Function to build project
build_project() {
    print_status "Building project..."
    
    if command_exists npm; then
        npm run build
        print_success "Project built successfully!"
    else
        print_error "npm not found. Please install Node.js first."
        exit 1
    fi
}

# Function to deploy to Webflow Cloud
deploy_project() {
    print_status "Deploying to Webflow Cloud..."
    
    if command_exists webflow; then
        webflow cloud deploy
        print_success "Project deployed successfully!"
    else
        print_error "Webflow CLI not found. Please install it first."
        exit 1
    fi
}

# Function to watch for Webflow changes
watch_webflow() {
    print_status "Watching for Webflow changes..."
    
    if command_exists webflow; then
        webflow devlink watch
    else
        print_error "Webflow CLI not found. Please install it first."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Webflow-First Development Workflow"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  sync        Sync components from Webflow"
    echo "  dev         Start development server"
    echo "  build       Build project for production"
    echo "  deploy      Deploy to Webflow Cloud"
    echo "  watch       Watch for Webflow changes"
    echo "  full        Full workflow: sync + dev"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 sync     # Sync components from Webflow"
    echo "  $0 dev      # Start development server"
    echo "  $0 full     # Sync components and start dev server"
}

# Main script logic
case "${1:-help}" in
    sync)
        sync_components
        ;;
    dev)
        start_dev
        ;;
    build)
        build_project
        ;;
    deploy)
        deploy_project
        ;;
    watch)
        watch_webflow
        ;;
    full)
        sync_components
        echo ""
        print_status "Starting development server in background..."
        start_dev &
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
