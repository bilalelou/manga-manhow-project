"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./CommentSection.module.css";
import { MessageSquareIcon, ThumbsUpIcon, ThumbsDownIcon, FlagIcon, TrashIcon, ClockIcon, FlameIcon, AlertTriangleIcon } from "@/app/components/Icons";

interface CommentUser {
    _id: string;
    username: string;
    avatar?: string;
    role: "user" | "translator" | "admin";
}

interface ReplyType {
    _id: string;
    manga: string;
    chapterNumber: number;
    user: CommentUser;
    content: string;
    likes: string[];
    dislikes: string[];
    reports: { user: string; reason: string }[];
    isHidden: boolean;
    createdAt: string;
}

interface CommentType {
    _id: string;
    manga: string;
    chapterNumber: number;
    user: CommentUser;
    content: string;
    likes: string[];
    dislikes: string[];
    reports: { user: string; reason: string }[];
    isHidden: boolean;
    createdAt: string;
    replies: ReplyType[];
}

interface CommentSectionProps {
    mangaId: string;
    chapterNumber: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const REPORT_REASONS = [
    { value: "spam", label: "سبام / إعلانات", icon: "📧" },
    { value: "offensive", label: "محتوى مسيء", icon: "🚫" },
    { value: "spoiler", label: "حرق أحداث (سبويلر)", icon: "⚠️" },
    { value: "harassment", label: "تنمر / تحرش", icon: "😡" },
    { value: "other", label: "سبب آخر", icon: "📝" },
];

export default function CommentSection({ mangaId, chapterNumber }: CommentSectionProps) {
    const { user, token } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "likes">("newest");

    // Reply state
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);

    // Like/Dislike animation state
    const [animatingLike, setAnimatingLike] = useState<string | null>(null);
    const [animatingDislike, setAnimatingDislike] = useState<string | null>(null);

    // Report modal state
    const [reportingId, setReportingId] = useState<string | null>(null);
    const [reportReason, setReportReason] = useState("");
    const [submittingReport, setSubmittingReport] = useState(false);

    // Expanded replies
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

    // Fetch comments
    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${API_URL}/comments/manga/${mangaId}/chapter/${chapterNumber}?sort=${sortBy}`
            );
            const data = await res.json();
            if (data.status === "success" && data.data) {
                setComments(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        } finally {
            setLoading(false);
        }
    }, [mangaId, chapterNumber, sortBy]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Show alert with auto-dismiss
    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    // Handle Comment Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        if (!user || !token) {
            showAlert("error", "يجب عليك تسجيل الدخول أولاً");
            return;
        }

        setSubmitting(true);
        setAlert(null);

        try {
            const res = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mangaId,
                    chapterNumber,
                    content: commentText.trim(),
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                setCommentText("");
                fetchComments();
                showAlert("success", "تم إضافة تعليقك بنجاح!");
            } else {
                showAlert("error", data.message || "فشل إرسال التعليق");
            }
        } catch (err) {
            showAlert("error", "حدث خطأ أثناء الاتصال بالخادم لإرسال التعليق");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Reply Submit
    const handleReplySubmit = async (parentId: string) => {
        if (!replyText.trim()) return;

        if (!user || !token) {
            showAlert("error", "يجب عليك تسجيل الدخول أولاً");
            return;
        }

        setSubmittingReply(true);

        try {
            const res = await fetch(`${API_URL}/comments/${parentId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: replyText.trim() }),
            });

            const data = await res.json();

            if (data.status === "success") {
                setReplyText("");
                setReplyingTo(null);
                // Auto-expand replies for this comment
                setExpandedReplies((prev) => new Set(prev).add(parentId));
                fetchComments();
                showAlert("success", "تم إضافة ردك بنجاح!");
            } else {
                showAlert("error", data.message || "فشل إرسال الرد");
            }
        } catch (err) {
            showAlert("error", "حدث خطأ أثناء الاتصال بالخادم");
        } finally {
            setSubmittingReply(false);
        }
    };

    // Handle Like
    const handleLike = async (commentId: string) => {
        if (!user || !token) {
            showAlert("error", "يجب عليك تسجيل الدخول أولاً");
            return;
        }

        setAnimatingLike(commentId);
        setTimeout(() => setAnimatingLike(null), 400);

        try {
            const res = await fetch(`${API_URL}/comments/${commentId}/like`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data.status === "success") {
                // Update local state without refetching
                setComments((prev) =>
                    prev.map((c) => {
                        if (c._id === commentId) {
                            return { ...c, likes: data.data.likes, dislikes: data.data.dislikes };
                        }
                        // Check replies
                        return {
                            ...c,
                            replies: c.replies.map((r) =>
                                r._id === commentId
                                    ? { ...r, likes: data.data.likes, dislikes: data.data.dislikes }
                                    : r
                            ),
                        };
                    })
                );
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    // Handle Dislike
    const handleDislike = async (commentId: string) => {
        if (!user || !token) {
            showAlert("error", "يجب عليك تسجيل الدخول أولاً");
            return;
        }

        setAnimatingDislike(commentId);
        setTimeout(() => setAnimatingDislike(null), 400);

        try {
            const res = await fetch(`${API_URL}/comments/${commentId}/dislike`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data.status === "success") {
                setComments((prev) =>
                    prev.map((c) => {
                        if (c._id === commentId) {
                            return { ...c, likes: data.data.likes, dislikes: data.data.dislikes };
                        }
                        return {
                            ...c,
                            replies: c.replies.map((r) =>
                                r._id === commentId
                                    ? { ...r, likes: data.data.likes, dislikes: data.data.dislikes }
                                    : r
                            ),
                        };
                    })
                );
            }
        } catch (err) {
            console.error("Failed to toggle dislike:", err);
        }
    };

    // Handle Report
    const handleReport = async () => {
        if (!reportingId || !reportReason) return;

        if (!user || !token) {
            showAlert("error", "يجب عليك تسجيل الدخول أولاً");
            return;
        }

        setSubmittingReport(true);

        try {
            const res = await fetch(`${API_URL}/comments/${reportingId}/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reason: reportReason }),
            });

            const data = await res.json();

            if (data.status === "success") {
                showAlert("success", data.message || "تم الإبلاغ بنجاح");
                setReportingId(null);
                setReportReason("");
            } else {
                showAlert("error", data.message || "فشل الإبلاغ");
            }
        } catch (err) {
            showAlert("error", "حدث خطأ أثناء الإبلاغ");
        } finally {
            setSubmittingReport(false);
        }
    };

    // Handle Comment Delete
    const handleDelete = async (commentId: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

        setDeletingId(commentId);
        setAlert(null);

        try {
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.status === "success") {
                fetchComments();
                showAlert("success", "تم حذف التعليق بنجاح.");
            } else {
                showAlert("error", data.message || "فشل حذف التعليق");
            }
        } catch (err) {
            showAlert("error", "حدث خطأ أثناء الاتصال بالخادم لحذف التعليق");
        } finally {
            setDeletingId(null);
        }
    };

    // Toggle replies visibility
    const toggleReplies = (commentId: string) => {
        setExpandedReplies((prev) => {
            const next = new Set(prev);
            if (next.has(commentId)) {
                next.delete(commentId);
            } else {
                next.add(commentId);
            }
            return next;
        });
    };

    // Date formatting helper
    const formatTime = (dateStr: string) => {
        try {
            const diff = Date.now() - new Date(dateStr).getTime();
            const minutes = Math.floor(diff / (1000 * 60));
            if (minutes < 1) return "الآن";
            if (minutes < 60) return `منذ ${minutes} دقيقة`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `منذ ${hours} ساعة`;
            const days = Math.floor(hours / 24);
            if (days === 1) return "أمس";
            if (days < 7) return `منذ ${days} أيام`;
            return new Date(dateStr).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return "قبل فترة";
        }
    };

    const getUserInitial = (username: string) => {
        return username ? username.trim().charAt(0).toUpperCase() : "?";
    };

    const getRoleName = (role: string) => {
        if (role === "admin") return "مدير";
        if (role === "translator") return "مترجم";
        return "";
    };

    // Total comments count including replies
    const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

    // Render a single comment item (used for both root comments and replies)
    const renderCommentItem = (
        comment: CommentType | ReplyType,
        isReply: boolean = false,
        parentId?: string
    ) => {
        const commentAuthor = comment.user || { _id: "", username: "عضو مجهول", role: "user" as const };
        const isOwner = user && commentAuthor._id === user._id;
        const isAuthorizedStaff = user && (user.role === "admin" || user.role === "translator");
        const canDelete = isOwner || isAuthorizedStaff;
        const isLiked = user && comment.likes?.includes(user._id);
        const isDisliked = user && comment.dislikes?.includes(user._id);
        const isLikeAnimating = animatingLike === comment._id;
        const isDislikeAnimating = animatingDislike === comment._id;

        if (comment.isHidden && !isAuthorizedStaff) {
            return (
                 <div key={comment._id} className={`${styles.commentItem} ${isReply ? styles.replyItem : ""} ${styles.hiddenComment}`}>
                     <div className={styles.hiddenMessage} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                         <AlertTriangleIcon size={14} style={{ color: "var(--color-accent)" }} />
                         <span>تم إخفاء هذا التعليق بسبب بلاغات متعددة.</span>
                     </div>
                 </div>
            );
        }

        return (
            <div
                key={comment._id}
                className={`${styles.commentItem} ${isReply ? styles.replyItem : ""}`}
            >
                {/* Avatar */}
                {commentAuthor.avatar ? (
                    <img
                        src={commentAuthor.avatar}
                        alt={commentAuthor.username}
                        className={styles.avatar}
                    />
                ) : (
                    <div className={`${styles.defaultAvatar} ${isReply ? styles.replyAvatar : ""}`}>
                        {getUserInitial(commentAuthor.username)}
                    </div>
                )}

                {/* Content */}
                <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                        <div className={styles.userMeta}>
                            <span className={styles.username}>{commentAuthor.username}</span>
                            {commentAuthor.role && commentAuthor.role !== "user" && (
                                <span
                                    className={`${styles.roleBadge} ${
                                        commentAuthor.role === "admin"
                                            ? styles.badgeAdmin
                                            : styles.badgeTranslator
                                    }`}
                                >
                                    {getRoleName(commentAuthor.role)}
                                </span>
                            )}
                            <span className={styles.commentTime}>
                                • {formatTime(comment.createdAt)}
                            </span>
                        </div>

                        {/* Delete button */}
                        {canDelete && (
                             <button
                                 type="button"
                                 onClick={() => handleDelete(comment._id)}
                                 disabled={deletingId === comment._id}
                                 className={styles.deleteBtn}
                                 title="حذف التعليق"
                                 style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                             >
                                 <TrashIcon size={12} />
                                 <span>{deletingId === comment._id ? "جاري..." : "حذف"}</span>
                             </button>
                        )}
                    </div>

                    <div className={styles.commentBody}>{comment.content}</div>

                    {/* Action Bar: Like, Dislike, Reply, Report */}
                    <div className={styles.actionBar}>
                        {/* Like */}
                        <button
                            type="button"
                            className={`${styles.actionBtn} ${isLiked ? styles.actionActive : ""} ${
                                isLikeAnimating ? styles.actionPop : ""
                            }`}
                            onClick={() => handleLike(comment._id)}
                            title="إعجاب"
                        >
                            <span className={styles.actionIcon}><ThumbsUpIcon size={16} /></span>
                            <span className={styles.actionCount}>
                                {comment.likes?.length || 0}
                            </span>
                        </button>

                        {/* Dislike */}
                        <button
                            type="button"
                            className={`${styles.actionBtn} ${isDisliked ? styles.actionActiveDislike : ""} ${
                                isDislikeAnimating ? styles.actionPop : ""
                            }`}
                            onClick={() => handleDislike(comment._id)}
                            title="عدم إعجاب"
                        >
                            <span className={styles.actionIcon}><ThumbsDownIcon size={16} /></span>
                            <span className={styles.actionCount}>
                                {comment.dislikes?.length || 0}
                            </span>
                        </button>

                        {/* Reply button (only for root comments) */}
                        {!isReply && user && (
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${
                                    replyingTo === comment._id ? styles.actionActive : ""
                                }`}
                                onClick={() => {
                                    setReplyingTo(
                                        replyingTo === comment._id ? null : comment._id
                                    );
                                    setReplyText("");
                                }}
                                title="رد"
                            >
                                <span className={styles.actionIcon}><MessageSquareIcon size={16} /></span>
                                <span>رد</span>
                            </button>
                        )}

                        {/* Report button */}
                        {user && !isOwner && (
                            <button
                                type="button"
                                className={styles.actionBtn}
                                onClick={() => {
                                    setReportingId(comment._id);
                                    setReportReason("");
                                }}
                                title="إبلاغ"
                            >
                                <span className={styles.actionIcon}><FlagIcon size={16} /></span>
                            </button>
                        )}
                    </div>

                    {/* Reply Form (inline) */}
                    {replyingTo === comment._id && (
                        <div className={styles.replyForm}>
                            <textarea
                                className={styles.replyTextarea}
                                placeholder={`رد على ${commentAuthor.username}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                maxLength={1000}
                                disabled={submittingReply}
                                autoFocus
                            />
                            <div className={styles.replyFormActions}>
                                <button
                                    type="button"
                                    className={styles.replyCancelBtn}
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText("");
                                    }}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    className={styles.replySubmitBtn}
                                    disabled={submittingReply || !replyText.trim()}
                                    onClick={() => handleReplySubmit(comment._id)}
                                >
                                    {submittingReply ? "جاري الإرسال..." : "إرسال الرد"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.commentSection} id="comment-section">
            <div className={styles.titleContainer}>
                 <h3 className={styles.sectionTitle} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                     <MessageSquareIcon size={18} style={{ color: "var(--color-accent)" }} />
                     <span>مناقشة الفصل</span>
                     <span className={styles.commentsCount}>{totalCount}</span>
                 </h3>
 
                 {/* Sort Toggle */}
                 <div className={styles.sortToggle}>
                     <button
                         type="button"
                         className={`${styles.sortBtn} ${sortBy === "newest" ? styles.sortActive : ""}`}
                         onClick={() => setSortBy("newest")}
                         style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                     >
                         <ClockIcon size={12} />
                         <span>الأحدث</span>
                     </button>
                     <button
                         type="button"
                         className={`${styles.sortBtn} ${sortBy === "likes" ? styles.sortActive : ""}`}
                         onClick={() => setSortBy("likes")}
                         style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                     >
                         <FlameIcon size={12} />
                         <span>الأكثر إعجاباً</span>
                     </button>
                 </div>
             </div>

            {/* Alert Message */}
            {alert && (
                <div
                    className={`${styles.alertMessage} ${
                        alert.type === "success" ? styles.alertSuccess : styles.alertError
                    }`}
                >
                    {alert.message}
                </div>
            )}

            {/* Post comment box */}
            {user ? (
                <form onSubmit={handleSubmit} className={styles.commentForm}>
                    <div className={styles.textareaWrapper}>
                        <textarea
                            className={styles.commentTextarea}
                            placeholder="شاركنا رأيك حول هذا الفصل..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            maxLength={1000}
                            disabled={submitting}
                            required
                        />
                    </div>
                    <div className={styles.formActions}>
                        <span className={styles.charCount}>
                            {commentText.length}/1000
                        </span>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || !commentText.trim()}
                            style={{
                                padding: "8px 24px",
                                fontSize: "0.9rem",
                                borderRadius: "8px",
                            }}
                        >
                            {submitting ? "جاري الإرسال..." : "إرسال التعليق"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className={styles.loginPrompt}>
                    يرجى{" "}
                    <a
                        href={`/login?redirect=/manga/${mangaId}/${chapterNumber}`}
                        className={styles.loginLink}
                    >
                        تسجيل الدخول
                    </a>{" "}
                    لكتابة تعليق والمشاركة في نقاش الفصول.
                </div>
            )}

            {/* Comments List */}
            {loading && comments.length === 0 ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner} />
                    جاري تحميل التعليقات...
                </div>
            ) : comments.length > 0 ? (
                <div className={styles.commentsList}>
                    {comments.map((comment) => (
                        <div key={comment._id} className={styles.commentThread}>
                            {/* Root comment */}
                            {renderCommentItem(comment, false)}

                            {/* Replies toggle & list */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className={styles.repliesSection}>
                                    <button
                                        type="button"
                                        className={styles.repliesToggle}
                                        onClick={() => toggleReplies(comment._id)}
                                    >
                                        <span className={styles.repliesLine} />
                                        <span className={styles.repliesToggleText}>
                                            {expandedReplies.has(comment._id)
                                                ? `إخفاء ${comment.replies.length} ${comment.replies.length === 1 ? "رد" : "ردود"}`
                                                : `عرض ${comment.replies.length} ${comment.replies.length === 1 ? "رد" : "ردود"}`}
                                        </span>
                                        <span
                                            className={`${styles.repliesArrow} ${
                                                expandedReplies.has(comment._id) ? styles.arrowUp : ""
                                            }`}
                                        >
                                            ▼
                                        </span>
                                    </button>

                                    {expandedReplies.has(comment._id) && (
                                        <div className={styles.repliesList}>
                                            {comment.replies.map((reply) =>
                                                renderCommentItem(reply, true, comment._id)
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                 <div className={styles.noComments}>
                     <MessageSquareIcon size={40} style={{ color: "rgba(255, 255, 255, 0.15)", marginBottom: "15px" }} />
                     <p>لا توجد تعليقات بعد في هذا الفصل.</p>
                    <p className={styles.noCommentsSubtext}>كن أول من يعلق!</p>
                </div>
            )}

            {/* Report Modal */}
            {reportingId && (
                <div className={styles.modalOverlay} onClick={() => setReportingId(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                         <div className={styles.modalHeader}>
                             <h4 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                 <FlagIcon size={16} style={{ color: "var(--color-accent)" }} />
                                 <span>الإبلاغ عن تعليق</span>
                             </h4>
                            <button
                                type="button"
                                className={styles.modalClose}
                                onClick={() => setReportingId(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <p className={styles.modalDesc}>
                            اختر سبب الإبلاغ عن هذا التعليق:
                        </p>
                        <div className={styles.reportReasons}>
                            {REPORT_REASONS.map((r) => (
                                <label
                                    key={r.value}
                                    className={`${styles.reportReason} ${
                                        reportReason === r.value ? styles.reportReasonSelected : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="report-reason"
                                        value={r.value}
                                        checked={reportReason === r.value}
                                        onChange={() => setReportReason(r.value)}
                                        className={styles.reportRadio}
                                    />
                                    <span className={styles.reportReasonIcon}>{r.icon}</span>
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.replyCancelBtn}
                                onClick={() => setReportingId(null)}
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                className={styles.reportSubmitBtn}
                                disabled={!reportReason || submittingReport}
                                onClick={handleReport}
                            >
                                {submittingReport ? "جاري الإرسال..." : "إرسال البلاغ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
