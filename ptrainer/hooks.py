app_name = "ptrainer"
app_title = "Ptrainer"
app_publisher = "YZ"
app_description = "Frappe APP to assist personal trainers in managing their clients. Made for byshujaa.com"
app_email = "yz.kh@icloud.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "ptrainer",
# 		"logo": "/assets/ptrainer/logo.png",
# 		"title": "Ptrainer",
# 		"route": "/ptrainer",
# 		"has_permission": "ptrainer.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/ptrainer/css/ptrainer.css"
# app_include_js = "/assets/ptrainer/js/ptrainer.js"

# include js, css files in header of web template
# web_include_css = "/assets/ptrainer/css/ptrainer.css"
# web_include_js = "/assets/ptrainer/js/ptrainer.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "ptrainer/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "ptrainer/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "ptrainer.utils.jinja_methods",
# 	"filters": "ptrainer.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "ptrainer.install.before_install"
# after_install = "ptrainer.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "ptrainer.uninstall.before_uninstall"
# after_uninstall = "ptrainer.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "ptrainer.utils.before_app_install"
# after_app_install = "ptrainer.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "ptrainer.utils.before_app_uninstall"
# after_app_uninstall = "ptrainer.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "ptrainer.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "Plan": {
        "on_update": "ptrainer.handlers.on_plan_update",
        "on_submit": "ptrainer.handlers.on_plan_update",
        "after_insert": "ptrainer.handlers.on_plan_update",
        "on_cancel": "ptrainer.handlers.on_plan_update",
        "on_trash": "ptrainer.handlers.on_plan_update"
    },
    "Membership": {
        "on_update": "ptrainer.handlers.on_membership_update",
        "on_submit": "ptrainer.handlers.on_membership_update",
        "on_cancel": "ptrainer.handlers.on_membership_update",
        "on_trash": "ptrainer.handlers.on_membership_update"
    },
    "Client": {
        "on_update": "ptrainer.handlers.on_client_update",
        "after_insert": "ptrainer.handlers.on_client_update",
        "on_trash": "ptrainer.handlers.on_client_update"
    },
    # Library items with less frequent updates
    "Exercise": {
        "on_update": "ptrainer.handlers.on_exercise_update"
    },
    "Food": {
        "on_update": "ptrainer.handlers.on_food_update"
    }
}

# Scheduled Tasks
# ---------------

scheduler_events = {
	# "all": [
	# 	"ptrainer.tasks.all"
	# ],
	# "daily": [
	# 	"ptrainer.tasks.daily"
	# ],
	"hourly": [
		"ptrainer.ptrainer.doctype.membership.membership.update_membership_statuses"
	],
# 	"weekly": [
# 		"ptrainer.tasks.weekly"
# 	],
# 	"monthly": [
# 		"ptrainer.tasks.monthly"
# 	],
}

# Testing
# -------

# before_tests = "ptrainer.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "ptrainer.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "ptrainer.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["ptrainer.utils.before_request"]
# after_request = ["ptrainer.utils.after_request"]

# Job Events
# ----------
# before_job = ["ptrainer.utils.before_job"]
# after_job = ["ptrainer.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"ptrainer.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

