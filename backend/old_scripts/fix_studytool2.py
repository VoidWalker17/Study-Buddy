with open("frontend/src/pages/StudyTool.tsx", "r") as f:
    code = f.read()

old_banner = """                      {(!result.questions || result.questions.length === 0) && (
                        <div className="mt-6 flex items-center gap-3 bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">No questions generated for this document. Cannot start exam.</p>
                        </div>
                      )}"""

new_banner = """                      {(!result.questions || result.questions.length === 0) && (
                        <div className="mt-6 flex items-center gap-3 bg-blue-500/10 text-blue-400 p-4 rounded-xl border border-blue-500/20">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">Exam questions failed to generate during upload due to AI rate limits. Click 'Start Final Exam' below to retry generating them!</p>
                        </div>
                      )}"""

code = code.replace(old_banner, new_banner)

with open("frontend/src/pages/StudyTool.tsx", "w") as f:
    f.write(code)

print("Fixed StudyTool banner")
