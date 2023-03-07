package(default_visibility = ["//visibility:public"])

load("@com_google_j2cl//build_defs:rules.bzl", "j2cl_library")

j2cl_library(
    name = "s2-j2cl",
    srcs = glob([
        "library/src/**/*.java",
        "library/src/super-j2cl/**/*.java",
        "library/src/super-j2cl/**/*.js",
    ], exclude=[
        "library/src/com/google/common/geometry/Platform.java",
    ]),
    deps = [
        "@com_google_code_findbugs_jsr305-j2cl",
        "@com_google_elemental2//:elemental2-promise-j2cl",
        "@com_google_errorprone_error_prone_annotations-j2cl",
        "@com_google_guava-j2cl",
        "@com_google_j2cl//:jsinterop-annotations-j2cl",
        "@com_google_j2objc_annotations-j2cl",
        "@org_checkerframework_checker_qual-j2cl",
    ],
)
